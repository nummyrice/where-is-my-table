from .db import db
from sqlalchemy.sql import func, expression
from sqlalchemy.types import DateTime
from sqlalchemy.ext.compiler import compiles
from .tags_join import waitlist_tags
import pytz
import datetime

class utcnow(expression.FunctionElement):
    type = DateTime()
    inherit_cache = True

@compiles(utcnow, 'postgresql')
def pg_utcnow(element, compiler, **kw):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"

@compiles(utcnow, 'mssql')
def ms_utcnow(element, compiler, **kw):
    return "GETUTCDATE()"


class Waitlist(db.Model):
    __tablename__ = "waitlist"

    # def establishment_now(self):
    #     timezone = pytz.timezone(self.establishment.get_timezone())
    #     now = timezone.localize(datetime.datetime.now())
    #     now.replace(tzinfo = None)
    #     print('NOW: ++++++++++++++', now)
    #     return now

    id = db.Column(db.Integer, primary_key=True)
    guest_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status_id= db.Column(db.Integer, db.ForeignKey('statuses.id'))
    party_size=db.Column(db.Integer, nullable=False)
    estimated_wait=db.Column(db.Integer, nullable=False)
    establishment_id=db.Column(db.Integer, db.ForeignKey('establishments.id'))
    created_at = db.Column(db.DateTime(), nullable=False, server_default=utcnow())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())


    # associations
    guest = db.relationship("User", back_populates="waitlist")
    status = db.relationship("Status", back_populates="waitlist")
    tags = db.relationship("Tag", secondary=waitlist_tags, back_populates="waitlist")
    establishment = db.relationship("Establishment", back_populates="waitlist")


    def to_dict(self):
        print('created_at______________: ', self.created_at.tzinfo)
        # timezone = pytz.timezone(self.establishment.get_timezone())
        timezone = pytz.timezone('Etc/UTC')


        return {
            "id": self.id,
            "guest_id": self.guest_id,
            "guest": self.guest.name,
            "guest_info": self.guest.to_safe_dict(),
            "status_id": self.status_id,
            "status": self.status.to_dict(),
            "party_size": self.party_size,
            "estimated_wait": self.estimated_wait,
            "tags": [tag.to_dict() for tag in self.tags],
            'created_at': timezone.localize(self.created_at, is_dst=True).isoformat(),
            # 'created_at': self.created_at,
            'updated_at': self.updated_at
        }
