from app.models import db, Reservation, User, Table
from datetime import datetime
from dateutil.relativedelta import relativedelta
from sqlalchemy.sql.expression import func



def seed_reservations():
    loop_start = datetime.now()
    loop_start.replace(hour=12)
    # function create reservations
    # for designated date range
    for date in range(1, 5, 1):
        # for designated time range each day
        for hour in range(12, 24, 1):
            # create new date for date now plus current range index
            reservation_time = datetime.now()
            # set time to designated hour
            adjusted_reservation_time = reservation_time.replace(day=date, hour=hour, minute=0, second=0, microsecond=0)
            # print('RESERVATIN TIME _______________: ', reservation_time)
            # guest_id is set to random guest from database
            guest_id = db.session.query(User.id).order_by(func.random()).first()[0]
            # table_id is set to random table from database
            table_id = db.session.query(Table.id).order_by(func.random()).first()[0]
            # party_size is within range of random table min and max
            party_size = db.session.query(Table.max_seat).filter(Table.id == table_id)

            # status_id = 3
            new_reservation = Reservation(
                reservation_time = adjusted_reservation_time,
                guest_id = guest_id,
                table_id = table_id,
                party_size = party_size,
                status_id = 3,
            )

            # db.session.add
            db.session.add(new_reservation)
            # commit
    db.session.commit()

    # reservation_1 = Reservation(
    #     guest_id = 2,
    #     party_size = 2,
    #     table_id = 1,
    #     reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
    #     status_id = 3,
    # )

    # reservation_2 = Reservation(
    #     guest_id = 3,
    #     party_size = 4,
    #     reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
    #     status_id = 3,
    # )

    # reservation_3 = Reservation(
    #     guest_id = 4,
    #     party_size = 1,
    #     table_id = 4,
    #     reservation_time = datetime(2021, 12, 17, 17, 30, 0, 0),
    #     status_id = 3,
    # )

    # # 5:45 reservations
    # reservation_4 = Reservation(
    #     guest_id = 4,
    #     party_size = 5,
    #     table_id = 5,
    #     reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
    #     status_id = 3,
    # )

    # reservation_5 = Reservation(
    #     guest_id = 5,
    #     party_size = 4,
    #     table_id = 6,
    #     reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
    #     status_id = 3,
    # )

    # reservation_6 = Reservation(
    #     guest_id = 6,
    #     party_size = 4,
    #     table_id = 6,
    #     reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
    #     status_id = 3,
    # )

    # # for lock test

    # reservation_7 = Reservation(
    #     guest_id = 1,
    #     party_size = 4,
    #     table_id = 7,
    #     reservation_time = datetime(2021, 12, 17, 17, 45, 0, 0),
    #     status_id = 3
    # )
    # target_date = datetime(2021, 12, 28, 8, 0, 0)
    # end_date = datetime(2021, 12, 31, 8, 0, 0)
    # while target_date < end_date:
    #     new_reservation = Reservation(
    #         guest_id = 1,
    #         party_size = 4,
    #         table_id = 8,
    #         reservation_time = target_date,
    #         status_id = 3
    #     )
    #     db.session.add(new_reservation)
    #     target_date = target_date + relativedelta(hours=1)

    # db.session.add(reservation_1)
    # db.session.add(reservation_2)
    # db.session.add(reservation_3)
    # db.session.add(reservation_4)
    # db.session.add(reservation_5)
    # db.session.add(reservation_6)
    # db.session.add(reservation_7)
    # db.session.commit()

def undo_reservations():
    db.session.execute('TRUNCATE reservations RESTART IDENTITY CASCADE;')
    db.session.commit()
