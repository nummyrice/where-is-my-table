from .db import db
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

default_schedule = {'monday':{
    1:{
        "start": {
            "hour":8,
            "minute": 0
        },
        "end": {
            "hour": 20,
            "minute": 0
        },
        "valid": True
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
        },
        "valid": True
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
        },
        "valid": True
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
        },
        "valid": True
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
        },
        "valid": True
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
        },
        "valid": True
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
        },
        "valid": True
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
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

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
