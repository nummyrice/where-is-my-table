from sqlalchemy.orm import backref
from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func
from .tags_join import guest_tags



class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255))
    phone_number = db.Column(db.String(255), nullable=False, unique=True)
    notes = db.Column(db.Text)
    hashed_password = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

    # associations
    reservations = db.relationship("Reservation", back_populates="guest", cascade="all, delete")
    waitlist = db.relationship("Waitlist", back_populates='guest', cascade="all, delete")
    establishment = db.relationship("Establishment", back_populates='user', cascade='all, delete', uselist=False)
    tags = db.relationship("Tag", secondary=guest_tags, back_populates="guests")

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
            'establishment': self.establishment.to_dict() if self.establishment else None,
            'hashed_password': self.hashed_password,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def to_safe_dict(self):
        return {
            "id": self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'notes': self.notes,
            'establishment': self.establishment.to_dict() if self.establishment else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def to_establishment_dict(self):
        return {
            "id": self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'notes': self.notes,
            'establishment': self.establishment.to_dict(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    def to_guest_dict(self):
        return {
            "id": self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'notes': self.notes,
            'tags': {tag.id: tag.name for tag in self.tags},
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
