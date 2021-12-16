from app.models import db, Status
from wheres_my_table.app.models import reservation

def seed_statuses():
    reserved = Status(
        name='Reserved'
    )
    left_message = Status(
        name='Left Message'
    )
    confirmed = Status(
        name="Confirmed"
    )
    late = Status(
        name="Late"
    )
    partially_arrived = Status(
        name="Partially Arrived"
    )
    arrived = Status(
        name='Arrived'
    )
    parially_seated = Status(
        name="Partially Seated"
    )
    seated = Status(
        name="Seated"
    )

    db.session.add(reserved)
    db.session.add(left_message)
    db.session.add(confirmed)
    db.session.add(late)
    db.session.add(partially_arrived)
    db.session.add(arrived)
    db.session.add(parially_seated)
    db.session.add(seated)

    db.session.commit()

def undo_statuses():
    db.session.execute('TRUNCATE statuses RESTART IDENTITY CASCADE;')
    db.session.commit()
