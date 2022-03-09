from .db import db
from sqlalchemy.sql import func

reservation_tags = db.Table('reservation_tags',
    db.Column('reservation_id', db.Integer, db.ForeignKey('reservations.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id')),
    db.Column('created_at', db.DateTime(), nullable=False, server_default=func.now()),
    db.Column('updated_at', db.DateTime(), onupdate=func.now(), default=func.now())
)

waitlist_tags = db.Table('waitlist_tags',
    db.Column('waitlist_id', db.Integer, db.ForeignKey('waitlist.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id')),
    db.Column('created_at', db.DateTime(), nullable=False, server_default=func.now()),
    db.Column('updated_at', db.DateTime(), onupdate=func.now(), default=func.now())
)

guest_tags = db.Table('guest_tags',
    db.Column('guest_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id')),
    db.Column('created_at', db.DateTime(), nullable=False, server_default=func.now()),
    db.Column('updated_at', db.DateTime(), onupdate=func.now(), default=func.now())
)
