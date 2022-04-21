from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, Length

class NewTableForm(FlaskForm):
    section_id = IntegerField('section_id', validators=[DataRequired()])
    table_name = StringField('table_name', validators=[DataRequired(), Length(min=1, max=40)])
    customer_view_name = StringField('customer_view_name', validators=[DataRequired(), Length(min=1, max=40)])
    min_seat = IntegerField('min_seat', validators=[DataRequired()])
    max_seat = IntegerField('max_seat', validators=[DataRequired()])

class EditTableForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    section_id = IntegerField('section_id', validators=[DataRequired()])
    table_name = StringField('table_name', validators=[DataRequired(), Length(min=1, max=40)])
    customer_view_name = StringField('customer_view_name', validators=[DataRequired(), Length(min=1, max=40)])
    min_seat = IntegerField('min_seat', validators=[DataRequired()])
    max_seat = IntegerField('max_seat', validators=[DataRequired()])
