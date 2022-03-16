from app.models import db, Timezone

def seed_timezones():

    EST_timezone = Timezone(
        luxon_string="America/New_York",
        name="EST/NewYork/Detroit"
    )
    db.session.add(EST_timezone)
    db.session.commit()

def undo_timezones():
    db.session.execute('TRUNCATE timezones RESTART IDENTITY CASCADE;')
    db.session.commit()
