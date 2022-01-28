from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Length, Optional
from app.models import User, db
from .signup_form import user_exists, username_exists, phone_num_exists
from sqlalchemy.exc import SQLAlchemyError
from .signup_form import validate_phone

def confirm_guest_exists(form, field):
    try:
        result = db.session.query(User).filter(User.id == field.data).one_or_none()
        if not result:
            raise ValidationError('Unable to locate resource in database')
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)

class NewGuestForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), username_exists, Length(min=1, max=40)])
    email = StringField('email', validators=[Optional(strip_whitespace=True), user_exists])
    notes = StringField('notes', validators=[Optional(strip_whitespace=True), Length(min=1, max=1000)])
    phone_number = StringField('phone_number', validators=[Length(min=10, max=11), DataRequired(), phone_num_exists, validate_phone])


class UpdateGuestForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired(), confirm_guest_exists])
    name = StringField('name', validators=[Optional(strip_whitespace=True), username_exists, Length(min=1, max=40)])
    email = StringField('email', validators=[Optional(), user_exists])
    notes = StringField('notes', validators=[Optional(), Length(min=1, max=1000)])
    phone_number = StringField('phone_number', validators=[Optional(strip_whitespace=True), Length(min=10, max=11), phone_num_exists, validate_phone])
