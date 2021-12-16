from .db import db
from sqlalchemy.sql import func
from .tags_join import reservation_tags

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    party_size = db.Column(db.Integer)
    reservation_time = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'))
    lock_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    status = db.relationship("Status", back_populates="reservations")
    guest = db.relationship("User", back_populates="reservations")
    tag = db.relationship("Tag", secondary=reservation_tags, back_populates="reservations")



    def to_dict(self):
        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "party_size": self.party_size,
            "reservation_time": self.reservation_time,
            "status_id": self.status_id,
            "lock_time": self.lock_time,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
