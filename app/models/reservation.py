from app.models.utils import UTCDateTime
from .db import db
from sqlalchemy.sql import func
from .tags_join import reservation_tags

class Reservation(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    party_size = db.Column(db.Integer)
    reservation_time = db.Column(UTCDateTime)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'))
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id'))
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    status = db.relationship("Status", back_populates="reservations")
    guest = db.relationship("User", back_populates="reservations")
    tags = db.relationship("Tag", secondary=reservation_tags, back_populates="reservations")
    table = db.relationship("Table", back_populates="reservations")



    def to_dict(self):
        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "guest": self.guest.name,
            "guest_info": self.guest.to_safe_dict(),
            "party_size": self.party_size,
            "reservation_time": self.reservation_time.isoformat(),
            "table_id": self.table_id,
            "table": self.table.to_dict(),
            "status_id": self.status_id,
            "status": self.status.to_dict(),
            "tags": [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
