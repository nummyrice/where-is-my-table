from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Reservation
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import parser
from app.forms import ReservationForm, EditReservationForm
from .auth_routes import validation_errors_to_error_messages

reservation_routes = Blueprint('reservations', __name__)

opening_time = 10
closing_time = 9

# query all the current reservations for that date sorted chronologically
def get_available_times(begin_date, end_date):
    end_date = end_date.isoformat()
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(begin_date, end_date)).all()
    available_times = []
    target_time = parser.isoparse(begin_date)
    closing_time = parser.isoparse(end_date)
    while target_time < closing_time:
        is_available = True
        for reservation in todays_res:
            booked_reservation_time = reservation.reservation_time
            if booked_reservation_time == target_time:
                is_available = False
                break
        if is_available:
            available_times.append({
                "party_size": None,
                "datetime": target_time.isoformat()
                })
        target_time = target_time + relativedelta(hours=1)
    # print('AVAILABLE TIMES_____: ', available_times )
    return { "available_times": available_times, "todays_res": todays_res }


# GET AVAILABLE TIMES
@reservation_routes.route('', methods=['POST'])
def todays_available_times():
    data = request.json
    beginning_date = data['client_date']
    print('DATES: ', parser.isoparse(beginning_date))
    ending_date = parser.isoparse(beginning_date) + relativedelta(days=1)
    data = get_available_times(beginning_date, ending_date)
    return data


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
@reservation_routes.route('/submit', methods=['POST'])
def reservation_submit():
    # call new message form
    form = ReservationForm()
    # check csrf
    form['csrf_token'].data = request.cookies['csrf_token']
    # if validate on submit
    if form.validate_on_submit():
        reservation_time = form.data['reservation_time']
        reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time).one_or_none()
        if  reservation_exists:
            res_updated_at = reservation_exists.updated_at
            pending_status: datetime = datetime.now() - res_updated_at
            if reservation_exists.status_id == 2 and (pending_status.total_seconds() / 60) < 10 and reservation_exists.guest_id != form.data['guest_id']:
                return {"result": "time unavailable"}, 400
            elif (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10) or (reservation_exists.status == 2 and (pending_status.total_seconds() / 60) > 10 and reservation_exists.guest_id == form.data['guest_id']):
                reservation_exists['guest_id'] = form.data['guest_id']
                reservation_exists['status_id'] = 3
                reservation_exists['party_size'] = form.data['party_size']
                db.session.commit()
                return {'result': "succesfully reserved"}, 200
        else:
            reservation = Reservation(
                    guest_id = form.data['guest_id'],
                    party_size = form.data['party_size'],
                    status_id = 3,
                    reservation_time = reservation_time,
                )
            db.session.add(reservation)
            db.session.commit()
            return {'result': "successfully reserved"}, 201

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# EDIT RESERVATION
@reservation_routes.route('/edit', methods=['PUT'])
def edit_reservation():
    form = EditReservationForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_time = parser.isoparse(form.data['reservation_time'])
        reservation_exists = db.session.query(Reservation).filter(Reservation.reservation_time == reservation_time).one_or_none()
        pending_status = None
        if reservation_exists:
            res_updated_at = reservation_exists.updated_at
            pending_status: datetime = datetime.now() - res_updated_at
        if not reservation_exists or reservation_exists and reservation_exists.status_id == 2 and (pending_status / 60) > 10:
            res_to_edit = db.session.query(Reservation).get(form.data['id'])
            res_to_edit.guest_id = form.data['guest_id']
            res_to_edit.party_size = form.data['party_size']
            res_to_edit.reservation_time = reservation_time
            db.session.commit()
            return {"result": "successfully updated"}
        return {'result': "reservation already exists for this time"}

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# DELETE RESERVATION
@reservation_routes.route('/cancel', methods=['PUT'])
def cancel_reservation():
    data = request.json
    target_res = db.session.query(Reservation).get(data['id'])
    target_res.status_id = 11
    db.session.commit()
    return {"result": "successfully cancelled", "reservation": target_res.to_dict()}
