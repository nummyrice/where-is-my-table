from .db import db
from sqlalchemy.sql import func
from .tags_join import reservation_tags, waitlist_tags

class Tag(db.Model):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    reservations = db.relationship("Reservation", secondary=reservation_tags, back_populates="tags")
    waitlist = db.relationship("Waitlist", secondary=waitlist_tags, back_populates="tags")


def to_dict(self):
    return {
        "id": self.id,
        "name": self.name,
        "waitlist_id": self.waitlist_id,
        "reservation_id": self.reservation_id,
        'created_at': self.created_at,
        'updated_at': self.updated_at

    }
