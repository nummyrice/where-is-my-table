from app.models.utils import UTCDateTime
from .db import db
from sqlalchemy.sql import func
from .tags_join import reservation_tags
# import pytz

class Reservation(db.Model):
    __tablename__ = 'reservations'
    """
    TypeDecorator UTCDateTime was defined to try to combat issue of naive datetime objects being submitted.
    However it seems the issue can instead be fixed by "inserting" a naïve datetime.
    Not sure why/how this works. Please see: https://stackoverflow.com/questions/26105730/sqlalchemy-converting-utc-datetime-to-local-time-before-saving
    """
    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    party_size = db.Column(db.Integer)
    reservation_time = db.Column(db.DateTime(timezone=True))
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'))
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'))
    establishment_id = db.Column(db.Integer, db.ForeignKey('establishments.id'))
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.id'))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), default=func.now())

    # associations
    status = db.relationship("Status", back_populates="reservations")
    guest = db.relationship("User", back_populates="reservations")
    tags = db.relationship("Tag", secondary=reservation_tags, back_populates="reservations")
    table = db.relationship("Table", back_populates="reservations")
    section = db.relationship("Section", back_populates="reservations")
    establishment = db.relationship("Establishment", back_populates="reservations")


    def to_dict(self):
        # timezone = pytz.timezone(self.establishment.get_timezone())
        # print("RESERVATION TIME:_________________", self.created_at.tzinfo)

        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "guest": self.guest.name,
            "guest_info": self.guest.to_safe_dict(),
            "party_size": self.party_size,
            "reservation_time": self.reservation_time.isoformat(),
            "table_id": self.table_id,
            "table": self.table.to_dict() if self.table_id else None,
            "section": self.section_id,
            "section_info": self.section.to_dict() if self.section_id else None,
            "status_id": self.status_id,
            "status": self.status.to_dict(),
            "tags": [tag.to_dict() for tag in self.tags],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
