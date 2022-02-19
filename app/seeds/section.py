from app.models import db, Section

def seed_sections():

    parlor = Section(
        establishment_id=1,
        name='Parlor'
    )

    clock = Section(
        establishment_id=1,
        name='Clock'
    )

    club = Section(
        establishment_id=1,
        name='Club'
    )

    bar = Section(
        establishment_id=1,
        name='Bar'
    )

    cafe = Section(
        establishment_id=1,
        name='Cafe'
    )

    biergarten = Section(
        establishment_id=1,
        name='Biergarten'
    )

    vineyard = Section(
        establishment_id=1,
        name='Vineyard'
    )

    db.session.add_all([parlor, clock, club, bar, cafe, biergarten, vineyard])
    db.session.commit()

def undo_sections():
    db.session.execute('TRUNCATE sections RESTART IDENTITY CASCADE;')
    db.session.commit()
