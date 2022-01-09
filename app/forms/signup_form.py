from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
import phonenumbers


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user and not field.data == '':
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    name = field.data
    user = User.query.filter(User.name == name).first()
    if user:
        raise ValidationError('name is already in use.')

def validate_phone(form, field):
    if len(field.data) > 16:
        raise ValidationError('Invalid phone number.')
    try:
        input_number = phonenumbers.parse(field.data)
        if not (phonenumbers.is_valid_number(input_number)):
            raise ValidationError('Invalid phone number.')
    except:
        input_number = phonenumbers.parse("+1"+field.data)
        if not (phonenumbers.is_valid_number(input_number)):
            raise ValidationError('Invalid phone number.')

def phone_num_exists(form, field):
    # Checking if phone number exists
    phone_number = field.data
    user = User.query.filter(User.phone_number == phone_number).first()
    if user:
        raise ValidationError('Phone number is already in use.')


class SignUpForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
    notes = StringField('notes')
    phone_number = StringField('phone_number', validators=[DataRequired(), phone_num_exists])
