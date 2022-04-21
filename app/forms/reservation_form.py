from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Optional

class ReservationForm(FlaskForm):
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    reservation_time = StringField('reservation_time', validators=[DataRequired()])
    section_id = IntegerField('section_id', validators=[Optional(strip_whitespace=True)])
    table_id = IntegerField('table_id', validators=[Optional(strip_whitespace=True)])

class UpdateReservationForm(FlaskForm):
    reservation_id = IntegerField('reservation_id', validators=[DataRequired()])
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    reservation_time = StringField('reservation_time', validators=[DataRequired()])
    section_id = IntegerField('section_id', validators=[Optional(strip_whitespace=True)])
    table_id = IntegerField('table_id', validators=[Optional(strip_whitespace=True)])

class GuestReservationForm(FlaskForm):
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    reservation_time = StringField('reservation_time', validators=[DataRequired()])
    section_id = IntegerField('section_id', validators=[Optional(strip_whitespace=True)])
    table_id = IntegerField('table_id', validators=[Optional(strip_whitespace=True)])
    establishment_id = IntegerField('establishment_id', validators=[DataRequired()])
