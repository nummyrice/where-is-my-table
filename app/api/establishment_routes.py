from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Establishment, Timezone
from app.forms import NewEstablishmentForm, EditEstablishmentForm
from .auth_routes import validation_errors_to_error_messages

establishment_routes = Blueprint('establishments', __name__)

# ADD NEW ESTABLISHMENT

@establishment_routes.route('new', methods=['POST'])
def create_new_establishment():
    form = NewEstablishmentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_establishment = Establishment(
            user_id = form.data["user_id"],
            name=form.data["name"],
            daylight_savings = form.data["daylight_savings"],
            timezone_id = form.data["timezone_id"]
        )
        db.session.add(new_establishment)
        db.session.commit()
        return {"message": "so successfuly"}, 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('edit', methods=['POST'])
def edit_establishment():
    target_establishment = db.session.query(Establishment).get(1)
    return target_establishment.to_dict(), 200

@establishment_routes.route('timezones', methods=['GET'])
def get_timezones():
    timezones = db.session.query(Timezone).all()
    return {"timezones": [timezone.to_dict() for timezone in timezones]}, 200
