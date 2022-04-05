from .db import db
from sqlalchemy.sql import func

class Status(db.Model):
    __tablename__ = "statuses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

    # Associations
    reservations = db.relationship("Reservation", back_populates="status")
    waitlist = db.relationship('Waitlist', back_populates="status")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }
