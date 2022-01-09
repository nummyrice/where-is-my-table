from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Reservation, Table
from sqlalchemy.sql import func
from datetime import datetime
from dateutil.relativedelta import relativedelta
from dateutil import parser
from app.forms import ReservationForm, UpdateReservationForm
from .auth_routes import validation_errors_to_error_messages

reservation_routes = Blueprint('reservations', __name__)

# generate table availability (accepts isodate string)
def get_availability(client_datetime):
    end_datetime = client_datetime + relativedelta(days=1)
    print('RANGE DATETIME: ', client_datetime, end_datetime)
    # query the database for all reservations for 24 hour period indicated by isodate string
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(client_datetime, end_datetime)).all()
    # query database for all tables
    tables = db.session.query(Table).all()
    availability = []
    available_time = client_datetime + relativedelta(hours=7)
    for hour in range(13):
    # iterate over tables
        # for each table create a datetime object for each hour
        available_time = available_time + relativedelta(hours=1)
        for table in tables:
        # if this time does not match any reservation for a table that was already placed
            if len(todays_res):
                for reservation in todays_res:
                    if not (reservation.reservation_time == available_time and reservation.table_id == table.id):
                        available_table = {
                            "datetime": available_time.isoformat(),
                            "table": table.to_dict()
                        }
                        availability.append(available_table)
            else:
                available_table = {
                            "datetime": available_time.isoformat(),
                            "table": table.to_dict()
                        }
                availability.append(available_table)
    return { "availability": availability, "reservations": [reservation.to_dict() for reservation in todays_res] }

# GET TODAYS AVAILABILITY
@reservation_routes.route('/today', methods=['POST'])
def todays_available_tables():
    data = request.json
    client_date = parser.isoparse(data['client_date'])
    data = get_availability(client_date)
    return data

# GET WEEKS AVAILABILITY
@reservation_routes.route('/seven-day', methods=['POST'])
def weeks_available_tables():
    data = request.json
    client_date = parser.isoparse(data['client_date'])
    seven_day_availability = []
    for date_increase in range(6):
        next_day = client_date + relativedelta(days=date_increase)
        todays_tables = get_availability(next_day)
        seven_day_availability.append({"date": next_day, 'availability': todays_tables['availability']})
    return {'sevenDayAvailability': seven_day_availability}


# CREATE RESERVATION TIME AND SET PENDING
@reservation_routes.route('/lock', methods=['POST'])
def reservation_lock():
    # print('DATETIME NOWWWWWWW_______: ', datetime.now())
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
    # call new message form
    form = ReservationForm()
    # check csrf
    form['csrf_token'].data = request.cookies['csrf_token']
    # if validate on submit
    if form.validate_on_submit():
        reservation_time = parser.parse(form.data['reservation_time'])
        reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time).one_or_none()
        if  reservation_exists:
            res_updated_at = reservation_exists.updated_at
            pending_status: datetime = datetime.now() - res_updated_at
            if reservation_exists.status_id == 2 and (pending_status.total_seconds() / 60) < 10 and reservation_exists.guest_id != form.data['guest_id']:
                return {"errors": ["time unavailable, please choose a different time"]}, 400
            elif (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10) or (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10 and reservation_exists.guest_id == form.data['guest_id']):
                reservation_exists['guest_id'] = form.data['guest_id']
                reservation_exists['status_id'] = 3
                reservation_exists['party_size'] = form.data['party_size']
                reservation_exists['table_id'] = form.data['table_id']
                db.session.commit()
                return {'result': "succesfully reserved"}, 200
            else:
                return {"errors": ["time unavailable, please choose a different time"]}, 400
        else:
            reservation = Reservation(
                    guest_id = form.data['guest_id'],
                    party_size = form.data['party_size'],
                    status_id = 3,
                    reservation_time = reservation_time,
                    table_id = form.data['table_id']
                )
            db.session.add(reservation)
            db.session.commit()
            return {'result': "successfully reserved", 'newReservation': reservation.to_dict()}, 201

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# UPDATE RESERVATION
@reservation_routes.route('/update', methods=['PUT'])
def edit_reservation():
    form = UpdateReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_time = parser.isoparse(form.data['reservation_time'])
        reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time).one_or_none()
        pending_status = None
        if reservation_exists:
            res_updated_at = reservation_exists.updated_at
            pending_status: datetime = datetime.now() - res_updated_at
        if not reservation_exists or reservation_exists and reservation_exists.status_id == 2 and (pending_status / 60) > 10:
            res_to_edit = db.session.query(Reservation).get(form.data['reservation_id'])
            res_to_edit.guest_id = form.data['guest_id']
            res_to_edit.party_size = form.data['party_size']
            res_to_edit.reservation_time = reservation_time
            res_to_edit.table_id = form.data['table_id']
            db.session.commit()
            return {"result": "successfully updated"}
        return {'errors': ["reservation already exists for this time"]}, 400

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# DELETE RESERVATION
@reservation_routes.route('/cancel', methods=['PUT'])
def cancel_reservation():
    data = request.json
    target_res = db.session.query(Reservation).get(data['id'])
    target_res.status_id = 11
    db.session.commit()
    return {"result": "successfully cancelled", "reservation": target_res.to_dict()}
