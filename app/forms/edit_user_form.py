from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class EditUserForm(FlaskForm):
    id = StringField('id')
    name = StringField('name')
    email = StringField('email')
    password = StringField('password')
    notes = StringField('notes')
    phone_number = StringField('phone_number')
