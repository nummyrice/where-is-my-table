from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class ReservationForm(FlaskForm):
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    reservation_time = StringField('reservation_time', validators=[DataRequired()])
