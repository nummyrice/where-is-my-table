from .db import db
from sqlalchemy.sql import func

# FOR REF WHEN IT COMES TO UPDATING SCHEDULE AND HOLIDAY PROPERTIES
# import copy
# doc.config = copy.deepcopy(doc.config)


class Establishment(db.Model):
    __tablename__ = 'establishments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String)
    timezone_id = db.Column(db.Integer, db.ForeignKey('timezones.id'), nullable=False, default=1)
    # schedule_override = db.Column(JSONB, nullable=False, default=lambda: {})
    daylight_savings = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

    # associations
    user = db.relationship("User", back_populates='establishment')
    sections = db.relationship("Section", back_populates='establishment')
    timezone = db.relationship("Timezone", back_populates='establishments')
    reservations = db.relationship("Reservation", back_populates='establishment')
    waitlist = db.relationship("Waitlist", back_populates='establishment')

    def get_timezone(self):
        return self.timezone.luxon_string

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'timezone': self.timezone.to_dict(),
            'daylight_savings': self.daylight_savings,
            'sections': { section.id : section.to_dict() for section in self.sections }
        }

    def get_establishment_id(self):
        return self.id
