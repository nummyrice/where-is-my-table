from flask import Blueprint, request
from app.models import db, Reservation
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import parser

reservation_routes = Blueprint('reservations', __name__)

opening_time = 10
closing_time = 9

# query all the current reservations for that date sorted chronologically
def get_available_times(begin_date, end_date):
    end_date = end_date.isoformat()
    # print('DATES_______: ', begin_date, end_date)
    todays_res = db.session.query(Reservation).filter(Reservation.reservation_time.between(begin_date, end_date)).all()
    # print('DATABASE QUERY: ', todays_res)
    available_times = {}
    target_time = parser.isoparse(begin_date)
    closing_time = parser.isoparse(end_date)
    # print('TARGET AND CLOSING_________: ', target_time, closing_time)
    index = 0
    while target_time < closing_time:
        is_available = True
        for reservation in todays_res:
            booked_reservation_time = reservation.reservation_time
            # print("RESERVATION TIME____________", booked_reservation_time, target_time)
            if booked_reservation_time == target_time:
                is_available = False
                break
        if is_available:
            available_times[index] = target_time.isoformat()
            index = index + 1
        target_time = target_time + relativedelta(hours=1)
    # print('AVAILABLE TIMES_____: ', )
    return available_times


# get all reservations for today's date
@reservation_routes.route('/', methods=['POST'])
def get_reservations():
    data = request.json
    beginning_date = data['client_date']
    print('DATES: ', parser.isoparse(beginning_date))
    ending_date = parser.isoparse(beginning_date) + relativedelta(days=1)
    available_times = get_available_times(beginning_date, ending_date)
    print('AVAILABLE TIMES_____', available_times)
    return available_times


# set/check lock for reservation
@reservation_routes.route('/lock', methods=['PUT'])
def reservation_lock():
    data = request.json
    reservation = Reservation.query.get(data['lock_reservation'])
    if not reservation:
        return "reservation not found", 404
    else:
        res_dict = reservation.to_dict()
        if res_dict["status_id"] == 2 and res_dict["lock_time"]:
            print("reservation: ", reservation.to_dict())
            return {"reservation": reservation}
