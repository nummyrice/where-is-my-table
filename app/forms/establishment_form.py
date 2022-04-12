from flask_wtf import FlaskForm
from app.models import db, User
from wtforms import StringField, IntegerField, BooleanField
from wtforms.validators import DataRequired, ValidationError, Length
from sqlalchemy.exc import SQLAlchemyError

def userAvailableCheck(form, field):
    try:
        user = db.session.query(User).get(field.data)
        if user and user.establishment:
            raise ValidationError("only one establishment allowed per user")
    except SQLAlchemyError as e:
        error = str(e.__dict__['orig'])
        raise ValidationError(error)


class NewEstablishmentForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired(), userAvailableCheck])
    name = StringField('name', validators=[DataRequired(), Length(min=1, max=40)])
    timezone_id = IntegerField('timezone_id', validators=[DataRequired()])
    daylight_savings = BooleanField('daylight_savings', validators=[DataRequired()])

class EditEstablishmentForm(FlaskForm):
    id = IntegerField('id', validators=[DataRequired()])
    name = StringField('name', validators=[Length(min=1, max=40)])
    daylight_savings = BooleanField('daylight_savings', validators=[DataRequired()])
