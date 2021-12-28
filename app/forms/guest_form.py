from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired
from app.models import User
from .signup_form import user_exists, username_exists, phone_num_exists, validate_phone

class GuestForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[user_exists])
    notes = StringField('notes')
    phone_number = StringField('phone_number', validators=[DataRequired(), validate_phone, phone_num_exists])
