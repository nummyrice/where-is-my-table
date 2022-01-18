from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError, Optional
from app.models import User
# import phonenumbers


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

# def validate_phone(form, field):
#     if len(field.data) > 16:
#         raise ValidationError('Invalid phone number.')
#     try:
#         input_number = phonenumbers.parse(field.data)
#         if not (phonenumbers.is_valid_number(input_number)):
#             raise ValidationError('Invalid phone number.')
#     except:
#         input_number = phonenumbers.parse("+1"+field.data)
#         if not (phonenumbers.is_valid_number(input_number)):
#             raise ValidationError('Invalid phone number.')

def phone_num_exists(form, field):
    # Checking if phone number exists
    phone_number = field.data
    user = User.query.filter(User.phone_number == phone_number).first()
    if user and user.to_dict()['hashed_password']:
        raise ValidationError('Phone number is already in use.')
    if user and not user.to_dict()['hashed_password']:
        raise ValidationError(f"200 {user.to_safe_dict()['id']} {user.to_safe_dict()['name']} This phone number exists, but is not attached to an account.")


class SignUpForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
    notes = StringField('notes')
    phone_number = StringField('phone_number', validators=[DataRequired(), phone_num_exists])


class ClaimUserForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    email = StringField('email', validators=[Optional(), user_exists])
    password = StringField('password', validators=[DataRequired()])
