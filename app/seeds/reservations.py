from app.models import db, Reservation
from datetime import datetime
from dateutil.relativedelta import relativedelta


def seed_reservations():

    # 5:30pm reservations
    reservation_1 = Reservation(
        guest_id = 1,
        party_size = 2,
        reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
        status_id = 3,
    )

    reservation_2 = Reservation(
        guest_id = 2,
        party_size = 4,
        reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
        status_id = 3,
    )

    reservation_3 = Reservation(
        guest_id = 3,
        party_size = 1,
        reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
        status_id = 3,
    )

    # 5:45 reservations
    reservation_4 = Reservation(
        guest_id = 4,
        party_size = 5,
        reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
        status_id = 3,
    )

    reservation_5 = Reservation(
        guest_id = 5,
        party_size = 4,
        reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
        status_id = 3,
    )

    reservation_6 = Reservation(
        guest_id = 6,
        party_size = 4,
        reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
        status_id = 3,
    )

    # for lock test

    reservation_7 = Reservation(
        guest_id = 1,
        party_size = 4,
        reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
        status_id = 2
    )
    target_date = datetime(2021, 12, 28, 8, 0, 0)
    end_date = datetime(2021, 12, 31, 8, 0, 0)
    while target_date < end_date:
        new_reservation = Reservation(
            guest_id = 1,
            party_size = 4,
            reservation_time = target_date,
            status_id = 3
        )
        db.session.add(new_reservation)
        target_date = target_date + relativedelta(hours=1)

    db.session.add(reservation_1)
    db.session.add(reservation_2)
    db.session.add(reservation_3)
    db.session.add(reservation_4)
    db.session.add(reservation_5)
    db.session.add(reservation_6)
    db.session.add(reservation_7)
    db.session.commit()

def undo_reservations():
    db.session.execute('TRUNCATE reservations RESTART IDENTITY CASCADE;')
    db.session.commit()
