from .db import db
from sqlalchemy.sql import func

class Timezone(db.Model):
    __tablename__ = "timezones"

    id = db.Column(db.Integer, primary_key=True)
    luxon_string = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime(), nullable=False, server_default=func.now())
    updated_at = db.Column(db.DateTime(), onupdate=func.now(), default=func.now())

    # associations
    establishments = db.relationship("Establishment", back_populates="timezone")


    def to_dict(self):
        return {
            "id": self.id,
            "luxon_string": self.luxon_string,
            "name": self.name,

        }
