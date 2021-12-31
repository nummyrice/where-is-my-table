from .db import db
from sqlalchemy.sql import func

class Table(db.Model):
    __tablename__ = 'tables'

    id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.String(120), nullable=False)
    min_seat = db.Column(db.Integer, nullable=False)
    max_seat = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    #associations
    reservations = db.relationship("Reservation", back_populates='table')

    def to_dict(self):
        return {
            "id": self.id,
            "table_name": self.table_name,
            "min_seat": self.min_seat,
            "max_seat": self.max_seat,
        }
