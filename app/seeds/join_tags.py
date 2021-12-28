from app.models import db
from app.models.tags_join import reservation_tags, waitlist_tags
from sqlalchemy import insert

def seed_tagged_reservations():
    tagged_reservations = insert(reservation_tags).values([
        {
        "reservation_id":1,
        "tag_id":1
        },
        {
        "reservation_id":1,
        "tag_id":2
        },
        {
        "reservation_id":1,
        "tag_id":3
        },
        {
        "reservation_id":1,
        "tag_id":4
        },
        {
        "reservation_id":2,
        "tag_id":5
        },
        {
        "reservation_id":2,
        "tag_id":6
        },
        {
        "reservation_id":2,
        "tag_id":7
        },
        {
        "reservation_id":3,
        "tag_id":8
        },
        {
        "reservation_id":3,
        "tag_id":9
        },
        {
        "reservation_id":4,
        "tag_id":10
        },
        {
        "reservation_id":4,
        "tag_id":11
        },
        {
        "reservation_id":5,
        "tag_id":12
        },
        {
        "reservation_id":5,
        "tag_id":13
        },
        {
        "reservation_id":6,
        "tag_id":14
        },
                {
        "reservation_id":6,
        "tag_id":15
        },
        {
        "reservation_id":6,
        "tag_id":16
        },
        {
        "reservation_id":6,
        "tag_id":17
        },
        {
        "reservation_id":6,
        "tag_id":18
        },
        {
        "reservation_id":6,
        "tag_id":19
        },
    ]
    )
    db.session.execute(tagged_reservations)
    db.session.commit()


def undo_tagged_reservations():
    db.session.execute('TRUNCATE reservation_tags RESTART IDENTITY CASCADE;')
    db.session.commit()


def seed_tagged_waitlist():
    tagged_waitlist = insert(waitlist_tags).values([
        {
            "waitlist_id": 1,
            "tag_id": 1
        },
         {
            "waitlist_id": 1,
            "tag_id": 2
        },
         {
            "waitlist_id": 1,
            "tag_id": 3
        },
         {
            "waitlist_id": 2,
            "tag_id": 4
        },
         {
            "waitlist_id": 2,
            "tag_id": 5
        },
    ])
    db.session.execute(tagged_waitlist)
    db.session.commit()

def undo_tagged_waitlist():
    db.session.execute('TRUNCATE waitlist_tags RESTART IDENTITY CASCADE;')
    db.session.commit()
