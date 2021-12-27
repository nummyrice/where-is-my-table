from .db import db
from sqlalchemy.sql import func
from .tags_join import waitlist_tags

class Waitlist(db.Model):
    __tablename__ = "waitlist"

    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status_id= db.Column(db.Integer, db.ForeignKey('statuses.id'))
    party_size=db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    guest = db.relationship("User", back_populates="waitlist")
    tags = db.relationship("Tag", secondary=waitlist_tags, back_populates="waitlist")



    def to_dict(self):
        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "status_id": self.status_id,
            "party_size": self.party_size,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
