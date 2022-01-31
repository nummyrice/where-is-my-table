from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.fields.core import IntegerField
from wtforms.validators import DataRequired, ValidationError, Length, Optional
from app.models import Tag, Reservation, Waitlist, db, reservation_tags, waitlist_tags
from sqlalchemy.exc import SQLAlchemyError

def confirm_reservation_exists(form, field):
    try:
        result = db.session.query(Reservation).filter(Reservation.id == field.data).one_or_none()
        if not result:
            raise ValidationError('Unable to locate resource in database')
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)

def confirm_party_exists(form, field):
    try:
        result = db.session.query(Waitlist).filter(Waitlist.id == field.data).one_or_none()
        if not result:
            raise ValidationError('Unable to locate resource in database')
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)


def confirm_tag_exists(form, field):
    try:
        result = db.session.query(Tag).filter(Tag.id == field.data).one_or_none()
        if not result:
            raise ValidationError('Unable to locate resource in database')
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)

def confirm_tag_name_exists(form, field):
    try:
        result = db.session.query(Tag).filter(Tag.name == field.data).one_or_none()
        if result:
            raise ValidationError('tag already exists')
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)

def tag_length(form, field):
    tagList = field.data.split(",")
    for tag in tagList:
        if len(tag) > 40:
            raise ValidationError('one or more of tags are greater than 40 characters. please seperate all tags by a space and ensure they are proper length')

class NewReservationTagForm(FlaskForm):
    name=StringField("name", validators=[DataRequired(), Length(min=1, max=40)])
    tag_id=IntegerField("tag_id", validators=[DataRequired(), confirm_tag_exists])
    reservation_id=IntegerField("reservation_id", validators=[DataRequired(), confirm_reservation_exists])

class NewTagsForm(FlaskForm):
    tags=StringField("tags", validators=[DataRequired(), tag_length])
    reservation_id=IntegerField('reservation_id', validators=[DataRequired(), confirm_reservation_exists])

class NewPartyTagsForm(FlaskForm):
    tags=StringField("tags", validators=[DataRequired(), tag_length])
    waitlist_id=IntegerField('waitlist_id', validators=[DataRequired(), confirm_party_exists])
