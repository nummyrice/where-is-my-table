from .db import db
from sqlalchemy.dialects.postgresql import JSONB

# FOR REF WHEN IT COMES TO UPDATING SCHEDULE AND HOLIDAY PROPERTIES
# import copy
# doc.config = copy.deepcopy(doc.config)

default_schedule = {'monday':{
    1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }},
    'tuesday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    },
    'wednesday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    },
    'thursday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    },
    'friday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    },
    'saturday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    },
    'sunday': {
        1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        }
    }
    }}
    # TODO: need to add table for holidays and schedule overrides
    # default_overrides = {1: {'start': '2022-16-05T00:48:00.000Z'}}

class Establishment(db.Model):
    __tablename__ = 'establishments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String)
    timezone_offset = db.Column(db.Integer, nullable=False, default=-5)
    schedule = db.Column(JSONB, nullable=False, default=default_schedule)
    # schedule_override = db.Column(JSONB, nullable=False, default=lambda: {})
    daylight_savings = db.Column(db.Boolean, nullable=False, default=True)

    # associations
    user = db.relationship("User", back_populates='establishment')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'timezone_offset': self.timezone_offset,
            'schedule': self.schedule,
            'daylight_savings': self.daylight_savings
        }
