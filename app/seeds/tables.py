from app.models import db, Table

def seed_tables():
    parlor_1 = Table(
        table_name = "parlor 1",
        min_seat = 1,
        max_seat = 2
    )

    parlor_2 = Table(
        table_name = "parlor 2",
        min_seat = 2,
        max_seat = 3
    )

    parlor_3 = Table(
        table_name = "parlor 3",
        min_seat = 1,
        max_seat = 2
    )

    pdr = Table(
        table_name = "PDR",
        min_seat = 3,
        max_seat = 6
    )

    clock_1 = Table(
        table_name = "clock 1",
        min_seat = 3,
        max_seat = 4
    )

    clock_2 = Table(
        table_name = "clock 2",
        min_seat = 3,
        max_seat = 4
    )

    clock_3 = Table(
        table_name = "clock 3",
        min_seat = 3,
        max_seat = 4
    )

    club_1 = Table(
        table_name = "club 1",
        min_seat = 1,
        max_seat = 2
    )

    club_2 = Table(
        table_name = "club 2",
        min_seat = 1,
        max_seat = 2
    )

    club_3 = Table(
        table_name = "club 3",
        min_seat = 2,
        max_seat = 4
    )

    club_4 = Table(
        table_name = "club 4",
        min_seat = 2,
        max_seat = 4
    )

    cafe_1= Table(
        table_name = "cafe 1",
        min_seat = 2,
        max_seat = 4
    )

    cafe_2= Table(
        table_name = "cafe 2",
        min_seat = 2,
        max_seat = 4
    )

    cafe_3= Table(
        table_name = "cafe 3",
        min_seat = 2,
        max_seat = 4
    )

    cafe_4= Table(
        table_name = "cafe 4",
        min_seat = 2,
        max_seat = 4
    )

    db.session.add(parlor_1)
    db.session.add(parlor_2)
    db.session.add(parlor_3)
    db.session.add(pdr)
    db.session.add(clock_1)
    db.session.add(clock_2)
    db.session.add(clock_3)
    db.session.add(club_1)
    db.session.add(club_2)
    db.session.add(club_3)
    db.session.add(club_4)
    db.session.add(cafe_1)
    db.session.add(cafe_2)
    db.session.add(cafe_3)
    db.session.add(cafe_4)
    db.session.commit()

def undo_seed_tables():
    db.session.execute('TRUNCATE tables RESTART IDENTITY CASCADE;')
    db.session.commit()
