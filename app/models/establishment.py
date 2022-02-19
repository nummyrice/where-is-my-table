from .db import db

# FOR REF WHEN IT COMES TO UPDATING SCHEDULE AND HOLIDAY PROPERTIES
# import copy
# doc.config = copy.deepcopy(doc.config)


class Establishment(db.Model):
    __tablename__ = 'establishments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String)
    timezone_offset = db.Column(db.Integer, nullable=False, default=-5)
    # schedule_override = db.Column(JSONB, nullable=False, default=lambda: {})
    daylight_savings = db.Column(db.Boolean, nullable=False, default=True)

    # associations
    user = db.relationship("User", back_populates='establishment')
    sections = db.relationship("Section", back_populates='establishment')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'timezone_offset': self.timezone_offset,
            'daylight_savings': self.daylight_savings,
            'sections': { section.id : section.to_dict() for section in self.sections }
        }
