from .db import db

reservation_tags = db.Table('reservation_tags', db.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('reservation_id', db.Integer, db.ForeignKey('reservation.id'))
)

waitlist_tags = db.Table('waitlist_tags', db.metadata,
    db.Column('id', db.Integer, primary_key=True),
    db.Column('waitlist_id', db.Integer, db.ForeignKey('waitlist.id'))
)
