from app.models import db, User
from faker import Faker
fake = Faker()

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        name='Demo', email='demo@aa.io', phone_number='555-555-5555', notes='loves to order dessert, always comes on Sunday', password='password1')
    marnie = User(
        name='marnie', email='marnie@aa.io', phone_number='777-777-7777', notes='allergy to shellfish, notify the manager', password='password2')
    bobbie = User(
        name='bobbie', email='bobbie@aa.io', phone_number='999-999-9999', notes='hard of hearing; must sit somewhere quiet', password='password3')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)

    db.session.commit()

    for x in range(4, 11):
        additional_User = User(
            name= f"{fake.first_name()}{x}",
            email = f"{x}{fake.profile()['mail']}",
            phone_number = fake.phone_number(),
            notes = fake.paragraph(nb_sentences=3),
            hashed_password = f"password{x}",
        )
        db.session.add(additional_User)

    db.session.commit()


# Uses a raw SQL query to TRUNCATE the users table.
# SQLAlchemy doesn't have a built in function to do this
# TRUNCATE Removes all the data from the table, and RESET IDENTITY
# resets the auto incrementing primary key, CASCADE deletes any
# dependent entities
def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
