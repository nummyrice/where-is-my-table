from app.models import db, Establishment

def seed_establishments():
    establishment_1 = Establishment(
        name='Village Baker',
        user_id=1,
    )
    db.session.add(establishment_1)
    db.session.commit()

def undo_establishments():
    db.session.execute('TRUNCATE establishments RESTART IDENTITY CASCADE;')
    db.session.commit()
