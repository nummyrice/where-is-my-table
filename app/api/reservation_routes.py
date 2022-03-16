from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Reservation, Table, Establishment
from sqlalchemy.sql import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dateutil import parser
from app.forms import ReservationForm, UpdateReservationForm
from .auth_routes import validation_errors_to_error_messages
from sqlalchemy import exc
import json
import pytz

reservation_routes = Blueprint('reservations', __name__)

def get_availability(client_datetime, sections, timezone_offset, daylight_savings):
    esta_offset = client_datetime + relativedelta(hours=timezone_offset)
    end_offset = esta_offset + relativedelta(days=1)
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(esta_offset, end_offset)).all()
    for res in todays_res:
        res.reservation_time = res.reservation_time.replace(tzinfo=pytz.utc)
    weekday = client_datetime.strftime('%A').lower()
    # get the earliest start time for given day
    est_open = None
    est_close = None
    for section_id in sections:
        if weekday in sections[section_id]['schedule']:
            weekday_blocks = list(sections[section_id]['schedule'][weekday].keys())
            last_block_key = max(weekday_blocks)
            start_hour = sections[section_id]['schedule'][weekday]['1']['start']['hour']
            start_minute = sections[section_id]['schedule'][weekday]['1']['start']['minute']
            end_hour = sections[section_id]['schedule'][weekday][last_block_key]['end']['hour']
            end_minute = sections[section_id]['schedule'][weekday][last_block_key]['end']['minute']
            start_offset_datetime = esta_offset + relativedelta(hours=start_hour, minutes=start_minute)
            end_offset_datetime = esta_offset + relativedelta(hours=end_hour, minutes=end_minute)
            if est_close == None:
                est_close = end_offset_datetime
            elif end_offset_datetime > est_close:
                est_close = end_offset_datetime
            if est_open == None:
                est_open = start_offset_datetime
            elif start_offset_datetime < est_open:
                est_open = start_offset_datetime
    # print('OPEN________________: ', est_open)
    # print('CLOSE________________: ', est_close)
    availability = []
    # iterate every 15 minutes from first scheduled start time
    target_time = est_open
    table_queues = {}
    while target_time < est_close:
        # iterate over sections
        for section_id in sections:
            if weekday in sections[section_id]['schedule']:
                # if sevction table list does not already exist in table_queues
                if not section_id in table_queues:
                    # define table queue consisting of this sections table ids
                    table_queues[section_id] = list(sections[section_id]['tables'].keys())
                # iterate over blocks for weekday
                if len(table_queues[section_id]):
                    section_open = False
                    for block in sections[section_id]['schedule'][weekday]:
                        # make a check to see if target_time is in between start and end time of any block in time blocks
                        current_block_start = esta_offset + relativedelta(hours=sections[section_id]['schedule'][weekday][block]['start']['hour'], minutes=sections[section_id]['schedule'][weekday][block]['start']['minute'])
                        current_block_end = esta_offset + relativedelta(hours=sections[section_id]['schedule'][weekday][block]['end']['hour'], minutes=sections[section_id]['schedule'][weekday][block]['end']['minute'])
                        if target_time > current_block_start and target_time < current_block_end:
                            section_open = True
                            break
                    if section_open:
                        # check the first table in the queue
                        target_table = table_queues[section_id][0]
                        # iterate over reservations
                        conflicting_res = False
                        for res in todays_res:
                            # if reservation exists for this table:
                            if res.table.id == target_table:
                                difference = res.reservation_time - target_time
                                # print('database reservation_________________: ', res.reservation_time)
                                # print('target time:', target_time)
                                print(abs(difference.total_seconds()) / 60)
                                # if none of these reservations exist within two hours + or - target_time
                                if (abs(difference.total_seconds()) / 60) < 120:
                                    conflicting_res = True
                                    break
                        if conflicting_res == False:
                            available_table = {
                            "datetime": target_time.isoformat(),
                            "table": sections[section_id]['tables'][target_table]
                            }
                            # add to table availability array
                            availability.append(available_table)
                            popped_target_table = table_queues[section_id].pop(0)
                            # move table to back of queue
                            table_queues[section_id].append(popped_target_table)
        # increase target_time by 15. minutes
        target_time = target_time + relativedelta(minutes=15)
    return { "availability": availability, "reservations": [reservation.to_dict() for reservation in todays_res] }

# GET TODAYS AVAILABILITY
@reservation_routes.route('/today', methods=['POST'])
def todays_available_tables():
    est_query = Establishment.query.filter_by(user_id=1).first()
    # est = establishment
    est = est_query.to_dict()
    data = request.json
    client_date = parser.isoparse(data['client_date'])
    data = get_availability(client_date, est["sections"], est["timezone_offset"], est["daylight_savings"])
    return data

# GET SELECTED DATE AVAILABILITY
@reservation_routes.route('/availability/selected-date', methods=['POST'])
def selected_dates_available_tables():
    est_query = Establishment.query.filter_by(user_id=1).first()
    # est = establishment
    est = est_query.to_dict()
    data = request.json
    selected_date = parser.isoparse(data['selected_date'])
    data = get_availability(selected_date, est["sections"], est["timezone_offset"], est["daylight_savings"])
    return {'selectedDateAvailability': data}

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
    client_datetime = parser.isoparse(data['selected_date'])
    end_offset = client_datetime + relativedelta(days=1)
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(client_datetime, end_offset)).all()
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


# SUBMIT RESERVATION
@reservation_routes.route('/new', methods=['POST'])
def reservation_submit():
    form = ReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # reservation_time = parser.parse(form.data['reservation_time'])
        reservation_time = datetime.fromisoformat(form.data['reservation_time'])
        print('RESERVATION TIME ?????????????????????????: ', reservation_time)
        print('RESERVATION TIME ?????????????????????????: ', reservation_time.tzinfo)
        reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time, Reservation.table_id == form.data['table_id']).one_or_none()
        if  reservation_exists:
            res_updated_at = reservation_exists.updated_at
            pending_status: datetime = datetime.now() - res_updated_at
            if reservation_exists.status_id == 2 and (pending_status.total_seconds() / 60) < 10 and reservation_exists.guest_id != form.data['guest_id']:
                return {"errors": ["time unavailable, please choose a different time"]}, 400
            elif (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10) or (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10 and reservation_exists.guest_id == form.data['guest_id']):
                reservation_exists['guest_id'] = form.data['guest_id']
                reservation_exists['status_id'] = 3
                reservation_exists['party_size'] = form.data['party_size']
                reservation_exists['section_id'] = form.data['section_id']
                db.session.commit()
                return reservation_exists.to_dict(), 200
            else:
                return {"errors": ["time unavailable, please choose a different time"]}, 400
        else:
            reservation = Reservation(
                    guest_id = form.data['guest_id'],
                    party_size = form.data['party_size'],
                    status_id = 3,
                    reservation_time = reservation_time.replace(tzinfo = None),
                    # reservation_time = reservation_time,
                    section_id = form.data['section_id'],
                    establishment_id = current_user.establishment.id
                )
            db.session.add(reservation)
            db.session.commit()
            return reservation.to_dict(), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# UPDATE RESERVATION
@reservation_routes.route('update', methods=['PUT'])
def edit_reservation():
    form = UpdateReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_time = parser.isoparse(form.data['reservation_time'])
        target_reservation = db.session.query(Reservation).get(form.data['reservation_id'])
        res_updated_at = target_reservation.updated_at
        pending_status = datetime.now() - res_updated_at
        if not target_reservation.status_id == 2 or (target_reservation.status_id == 2 and (pending_status / 60) > 10):
            target_reservation.guest_id = form.data['guest_id']
            target_reservation.party_size = form.data['party_size']
            target_reservation.reservation_time = reservation_time.replace(tzinfo = None)
            target_reservation.table_id = form.data['table_id']
            target_reservation.section_id = form.data['section_id']
            db.session.commit()
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
        return {"result": "successfully updated reservation status", "reservation": reservation.to_dict()}
    except:
        return {"errors": "there was a server error updating the reservation status"}


# DELETE RESERVATION
@reservation_routes.route('/cancel', methods=['PUT'])
def cancel_reservation():
    data = request.json
    target_res = db.session.query(Reservation).get(data['id'])
    target_res.status_id = 11
    db.session.commit()
    return {"result": "successfully cancelled", "reservation": target_res.to_dict()}
