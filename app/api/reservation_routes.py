from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Reservation, Table, Establishment, Section
from sqlalchemy.sql import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dateutil import parser
from app.forms import ReservationForm, UpdateReservationForm, GuestReservationForm
from .auth_routes import validation_errors_to_error_messages
from sqlalchemy import exc
import json
import pytz
from app.sockets import distribute_new_res, distribute_update_res, distribute_res_status_change

reservation_routes = Blueprint('reservations', __name__)

# iterate through the schedule for each section
# iterate through the tables and set one to each 15minute time slot UNLESS a reservation exists within two hours for that given table
#
def get_sections(establishment_id):
    sections = db.session.query(Section).filter(Section.establishment_id == establishment_id)
    return [section.to_dict() for section in sections]

# MODEL
    # [{res_time: isotimestamp_, table_details: }]
def get_availability(client_iso, sections, daylight_savings):
    day_start = parser.isoparse(client_iso)
    weekday = day_start.strftime('%A').lower()
    available_tables = []
    # print('sections: ', sections)
    for section in sections:
        if weekday in section['schedule']:
            for blockId, block in section['schedule'][weekday].items():
                block_start_hour = block['start']['hour']
                block_start_minute = block['start']['minute']
                block_end_hour = block['end']['hour']
                block_end_minute = block['end']['minute']
                block_start_time = day_start + relativedelta(hours=block_start_hour, minutes=block_start_minute)
                block_end_time = day_start + relativedelta(hours=block_end_hour, minutes=block_end_minute)
                block_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(block_start_time, block_end_time), Reservation.section_id == section['id']).all()
                block_res_list = [res.to_dict() for res in block_res]
                tables = section['tables']
                table_keys = list(tables.keys())
                # print("available_tables________________: ", available_tables)
                target_time = block_start_time
                if len(table_keys):
                    select_table_key = 0
                    # print("compare times", block_start_time, block_end_time)
                    while target_time < block_end_time:
                        # print('keys: ', select_table_key)
                        select_table = tables[table_keys[select_table_key]]
                        table_free = True
                        for res in block_res_list:
                            if res['table_id'] == select_table['id']:
                                time_delta = res.reservation_time - target_time
                                if abs(time_delta.total_seconds()) / 3600 < 2:
                                    table_free = False
                                    break
                        if table_free:
                            table = {'res_time': target_time.isoformat(), 'table_details': select_table}
                            available_tables.append(table)
                        target_time = target_time + relativedelta(minutes=30)
                        select_table_key += 1
                        if select_table_key > len(table_keys) - 1:
                            select_table_key = 0
    return { "available_tables": available_tables }


# GET TODAYS AVAILABILITY
@reservation_routes.route('/today', methods=['POST'])
def todays_available_tables():
    est_query = Establishment.query.filter_by(user_id=1).first()
    # est = establishment
    est = est_query.to_dict()
    data = request.json
    client_date = parser.isoparse(data['client_date'])
    data = get_availability(client_date, est["sections"], est["timezone"]["luxon_string"], est["daylight_savings"])
    return data

# GET SELECTED DATE AVAILABILITY
@reservation_routes.route('/<string:establishment_name>-<int:establishment_id>/availability', methods=['POST'])
def selected_dates_available_tables(establishment_name, establishment_id):
    establishment = db.session.query(Establishment).get(establishment_id)
    data = request.json
    sections = get_sections(establishment.id)
    return get_availability(data['client_date'], sections,  establishment.daylight_savings), 200

# GET WEEKS AVAILABILITY
@reservation_routes.route('/seven-day', methods=['POST'])
def weeks_available_tables():
    data = request.json
    client_date = parser.isoparse(data['client_date'])
    est_query = Establishment.query.filter_by(user_id=1).first()
    est = est_query.to_dict()
    seven_day_availability = []
    for date_increase in range(6):
        next_day = client_date + relativedelta(days=date_increase)
        todays_tables = get_availability(next_day, est["sections"], est["timezone_offset"], est["daylight_savings"])
        seven_day_availability.append({"date": next_day, 'availability': todays_tables['availability']})
    return {'sevenDayAvailability': seven_day_availability}

# GET RESERVATIONS FOR SET DATE
@reservation_routes.route('/selected-date', methods=['POST'])
def get_reservations():
    data = request.json
    establishment_id = current_user.establishment.id
    client_datetime = parser.isoparse(data['selected_date'])
    end_offset = client_datetime + relativedelta(days=1)
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(client_datetime, end_offset), Reservation.establishment_id == establishment_id).all()
    return {reservation.id: reservation.to_dict() for reservation in todays_res}

# CREATE RESERVATION TIME AND SET PENDING
@reservation_routes.route('/lock', methods=['POST'])
def reservation_lock():
    data = request.json
    target_datetime = parser.isoparse(data['lock_reservation'])
    reservation = db.session.query(Reservation).filter(Reservation.reservation_time == target_datetime).one_or_none()
    if reservation:
        pending_time: datetime = datetime.now() - reservation.updated_at
        if reservation.status_id == 2 and (pending_time.total_seconds() / 60) < 10:
            return {"result": "time unavailable"}, 409
        elif reservation.status_id == 2 and (pending_time.total_seconds() / 60) > 10:
            #todo: set to current_user.id and require login
            reservation.guest_id = 2
            db.session.commit()
            return {"result": "set pending"}, 200
    else:
        #todo: set to current_user.id and require login
        pending_res = Reservation(
            guest_id= 1,
            party_size= 1,
            reservation_time= target_datetime,
            status_id= 2,
        )
        db.session.add(pending_res)
        db.session.commit()
        return {"result": "set pending"}, 201

# GUEST RESERVATION SUBMIT
@reservation_routes.route('/new/<establishment_name>', methods=['POST'])
def guest_reservation_submit(establishment_name):
    form = GuestReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # reservation_time = parser.parse(form.data['reservation_time'])
        reservation_time = datetime.fromisoformat(form.data['reservation_time'])
        # reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time, Reservation.table_id == form.data['table_id']).one_or_none()
        reservation = Reservation(
                guest_id = form.data['guest_id'],
                party_size = form.data['party_size'],
                status_id = 3,
                # reservation_time = reservation_time.replace(tzinfo = None),
                reservation_time = reservation_time,
                section_id = form.data['section_id'],
                establishment_id = form.data['establishment_id']
            )
        db.session.add(reservation)
        db.session.commit()
        establishment_id = f'establishment_{reservation.establishment_id}'
        distribute_new_res(reservation.to_dict(),establishment_id)
        return reservation.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# SUBMIT RESERVATION
@reservation_routes.route('/new', methods=['POST'])
def reservation_submit():
    form = ReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # reservation_time = parser.parse(form.data['reservation_time'])
        reservation_time = datetime.fromisoformat(form.data['reservation_time'])
        # reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time, Reservation.table_id == form.data['table_id']).one_or_none()
        reservation = Reservation(
                guest_id = form.data['guest_id'],
                party_size = form.data['party_size'],
                status_id = 3,
                # reservation_time = reservation_time.replace(tzinfo = None),
                reservation_time = reservation_time,
                section_id = form.data['section_id'],
                establishment_id = current_user.establishment.id
            )
        db.session.add(reservation)
        db.session.commit()
        establishment_id = f'establishment_{reservation.establishment_id}'
        distribute_new_res(reservation.to_dict(),establishment_id)
        return reservation.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400
        # if  reservation_exists:
        #     res_updated_at = reservation_exists.updated_at
        #     pending_status: datetime = datetime.now() - res_updated_at.replace(tzinfo=None)
        #     if reservation_exists.status_id == 2 and (pending_status.total_seconds() / 60) < 10 and reservation_exists.guest_id != form.data['guest_id']:
        #         return {"errors": ["time unavailable, please choose a different time"]}, 400
        #     elif (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10) or (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10 and reservation_exists.guest_id == form.data['guest_id']):
        #         reservation_exists['guest_id'] = form.data['guest_id']
        #         reservation_exists['status_id'] = 3
        #         reservation_exists['party_size'] = form.data['party_size']
        #         reservation_exists['section_id'] = form.data['section_id']
        #         db.session.commit()
        #         return reservation_exists.to_dict(), 200
        #     else:
        #         return {"errors": ["time unavailable, please choose a different time"]}, 400
        # else:

# UPDATE RESERVATION
@reservation_routes.route('update', methods=['PUT'])
def edit_reservation():
    form = UpdateReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_time = parser.isoparse(form.data['reservation_time'])
        target_reservation = db.session.query(Reservation).get(form.data['reservation_id'])
        res_updated_at = target_reservation.updated_at
        pending_status = datetime.now() - res_updated_at.replace(tzinfo=None)
        if not target_reservation.status_id == 2 or (target_reservation.status_id == 2 and (pending_status / 60) > 10):
            target_reservation.guest_id = form.data['guest_id']
            target_reservation.party_size = form.data['party_size']
            target_reservation.reservation_time = reservation_time
            target_reservation.table_id = form.data['table_id']
            target_reservation.section_id = form.data['section_id']
            db.session.commit()
            distribute_update_res(target_reservation.to_dict(), f'establishment_{target_reservation.establishment_id}')
            return target_reservation.to_dict(), 201
        return {'errors': ["reservation already exists for this time"]}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# UPDATE RESERVATION FIRST METHOD
# @reservation_routes.route('/update', methods=['PUT'])
# def edit_reservation():
#     form = UpdateReservationForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     if form.validate_on_submit():
#         reservation_time = parser.isoparse(form.data['reservation_time'])
#         reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time, Reservation.table_id == form.data['table_id']).one_or_none()
#         pending_status = None
#         if reservation_exists:
#             res_updated_at = reservation_exists.updated_at
#             pending_status: datetime = datetime.now() - res_updated_at
#         if not reservation_exists or reservation_exists and reservation_exists.status_id == 2 and (pending_status / 60) > 10:
#             res_to_edit = db.session.query(Reservation).get(form.data['reservation_id'])
#             res_to_edit.guest_id = form.data['guest_id']
#             res_to_edit.party_size = form.data['party_size']
#             res_to_edit.reservation_time = reservation_time
#             res_to_edit.table_id = form.data['table_id']
#             db.session.commit()
#             return {"result": "successfully updated", "reservation": res_to_edit.to_dict()}
#         return {'errors': ["reservation already exists for this time"]}, 400

#     return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# UPDATE RESERVATION STATUS
@reservation_routes.route('/status/update', methods=['PUT'])
def edit_status():
    data = request.json
    try:
        reservation = db.session.query(Reservation).get(data['reservation_id'])
        reservation.status_id = data['status_id']
        db.session.commit()
        distribute_res_status_change(reservation.to_dict(), f'establishment_{reservation.establishment_id}')
        return {"result": "successfully updated reservation status", "reservation": reservation.to_dict()}, 200
    except:
        return {"errors": "there was a server error updating the reservation status"}, 400


# DELETE RESERVATION
@reservation_routes.route('/cancel', methods=['PUT'])
def cancel_reservation():
    data = request.json
    target_res = db.session.query(Reservation).get(data['id'])
    target_res.status_id = 11
    db.session.commit()
    return {"result": "successfully cancelled", "reservation": target_res.to_dict()}
