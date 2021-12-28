from app.models import db, Waitlist

def seed_waitlist():
    guest_1 = Waitlist(
        guest_id=7,
        party_size=4
    )
    guest_2 = Waitlist(
        guest_id=8,
        party_size=2
    )
    db.session.add(guest_1)
    db.session.add(guest_2)
    db.session.commit()


def undo_waitlist():
    db.session.execute('TRUNCATE waitlist RESTART IDENTITY CASCADE;')
    db.session.commit()
