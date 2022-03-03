from .db import db
from sqlalchemy.dialects.postgresql import JSONB

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

class Section(db.Model):
    __tablename__ = 'sections'

    id = db.Column(db.Integer, primary_key=True)
    establishment_id = db.Column(db.Integer, db.ForeignKey('establishments.id'))
    schedule = db.Column(JSONB, nullable=False, default=default_schedule)
    name = db.Column(db.String, nullable=False)

    #associations
    tables = db.relationship("Table", back_populates='section')
    establishment = db.relationship("Establishment", back_populates='sections')
    reservations = db.relationship("Reservation", back_populates='section')

    def id_and_name(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "tables": { table.id : table.to_dict() for table in self.tables },
            "schedule": self.schedule
        }
