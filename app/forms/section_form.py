from flask_wtf import FlaskForm
# from app.models import db, User
from wtforms import StringField, IntegerField, Field
from wtforms.validators import DataRequired, ValidationError, Length
# from sqlalchemy.exc import SQLAlchemyError

def validate_schedule(form, field):
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    new_schedule = field.data
    for day in new_schedule:
        if day not in days:
            raise ValidationError('there seems to be an issue with your schedule model; must contain 7 days')
        prev_block_end_hour = 0
        prev_block_end_minute = 0
        sequence = sorted(new_schedule[day].keys())
        for numKey in sequence:
            time_block_start_hour = new_schedule[day][numKey]['start']['hour']
            time_block_start_minute = new_schedule[day][numKey]['start']['minute']
            time_block_end_hour = new_schedule[day][numKey]['end']['hour']
            time_block_end_minute = new_schedule[day][numKey]['end']['minute']
            if time_block_start_hour > time_block_end_hour:
                raise ValidationError(f'time block: start({day} {numKey}) must not be greater than or equal to end({day} {numKey})')
            if time_block_start_hour == time_block_end_hour and time_block_start_minute >= time_block_end_minute:
                    raise ValidationError(f'time block: start({day} {numKey}) must not be greater than or equal to end({day} {numKey})')
            if numKey != '1':
                if time_block_start_hour < prev_block_end_hour:
                    raise ValidationError(f'conflicting time blocks: start({day} {numKey}) must not be less than or equal to previous block end({day})')
                if time_block_start_hour == prev_block_end_hour and time_block_start_minute < prev_block_end_minute:
                    raise ValidationError(f'conflicting time blocks: start({day} {numKey}) must not be less than or equal to previous block end({day})')
            prev_block_end_hour = time_block_end_hour
            prev_block_end_minute = time_block_end_minute
            new_schedule[day][numKey]['valid'] = True

class JSONScheduleField(Field):
    def process_formdata(self, JSON_schedule):
        if JSON_schedule:
            self.data = JSON_schedule[0]
        else:
            self.data = {}

class NewSectionForm(FlaskForm):
    establishment_id = IntegerField('establishment_id', validators=[DataRequired()])
    name = StringField('name', validators=[DataRequired(), Length(min=1, max=40)])
    schedule = JSONScheduleField('schedule', validators=[DataRequired(), validate_schedule])


class EditSectionForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    name = StringField('name', validators=[DataRequired(), Length(min=1, max=40)])
    schedule = JSONScheduleField('schedule', validators=[DataRequired(), validate_schedule])
