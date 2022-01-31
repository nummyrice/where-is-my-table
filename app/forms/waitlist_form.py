from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class WaitlistForm(FlaskForm):
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    estimated_wait = IntegerField('estimated_wait', validators=[DataRequired()])


class UpdateWaitlistForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    guest_id = IntegerField('guest_id', validators=[DataRequired()])
    party_size = IntegerField('party_size', validators=[DataRequired()])
    estimated_wait = IntegerField('estimated_wait', validators=[DataRequired()])
