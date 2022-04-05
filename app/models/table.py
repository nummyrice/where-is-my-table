from .db import db
from sqlalchemy.sql import func

def customer_view_name_default(context):
    return context.get_current_parameters()['table_name']

class Table(db.Model):
    __tablename__ = 'tables'

    id = db.Column(db.Integer, primary_key=True)
    table_name = db.Column(db.String(120), nullable=False)
    min_seat = db.Column(db.Integer, nullable=False)
    max_seat = db.Column(db.Integer, nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'))
    customer_view_name = db.Column(db.String, default=customer_view_name_default)
    table_type = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

    #associations
    reservations = db.relationship("Reservation", back_populates='table')
    section = db.relationship("Section", back_populates='tables')

    def to_dict(self):
        return {
            "id": self.id,
            "table_name": self.table_name,
            "min_seat": self.min_seat,
            "max_seat": self.max_seat,
            "section": self.section.id_and_name(),
            "customer_view_name": self.customer_view_name,
        }
