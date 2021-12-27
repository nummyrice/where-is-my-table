from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateTimeField
from wtforms.validators import DataRequired

class ReservationForm(FlaskForm):
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    reservation_time = DateTimeField('reservation_time', validators=[DataRequired()])
