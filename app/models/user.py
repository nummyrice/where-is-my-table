from sqlalchemy.orm import backref
from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func



class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), unique=True)
    phone_number = db.Column(db.String(255), nullable=False, unique=True)
    notes = db.Column(db.Text)
    hashed_password = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    reservations = db.relationship("Reservation", back_populates="guest", cascade="all, delete")
    waitlist = db.relationship("Waitlist", back_populates='guest', cascade="all, delete")
    # tags = db.relationship()

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'notes': self.notes,
            'hashed_password': self.hashed_password,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    def to_safe_dict(self):
        return {
            "id": self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'notes': self.notes,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'tags': [{"tag_id": 2, "name": "test"}]
        }
