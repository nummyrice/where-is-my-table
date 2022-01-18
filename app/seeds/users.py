from app.models import db, User
from faker import Faker
fake = Faker()

# Adds a demo user, you can add other users here if you want
def seed_users():
    establishment_demo = User(
        name='Restaurant', email='establishment_demo@aa.io', phone_number='5555555555', notes='loves to order dessert, always comes on Sunday', password='password1')
    marnie = User(
        name='marnie', email='marnie@aa.io', phone_number='7777777777', notes='allergy to shellfish, notify the manager', password='password2')
    bobbie = User(
        name='bobbie', email='bobbie@aa.io', phone_number='9999999999', notes='hard of hearing; must sit somewhere quiet', password='password3')
    guest_demo = User(
        name='DemoGuest', email='guest_demo@aa.io', phone_number='6666666666', notes='great guest; please give complimentary appetizer each visit', password='password4')

    db.session.add(establishment_demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.add(guest_demo)

    db.session.commit()

    for x in range(4, 11):
        additional_User = User(
            name= f"{fake.first_name()}{x}",
            email = f"{x}{fake.profile()['mail']}",
            phone_number = fake.msisdn()[3:],
            notes = fake.paragraph(nb_sentences=3),
            password = f"password{x}",
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
