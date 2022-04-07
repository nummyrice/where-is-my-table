from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Establishment, Timezone, Section, section
from app.forms import NewEstablishmentForm, EditEstablishmentForm
from .auth_routes import validation_errors_to_error_messages

establishment_routes = Blueprint('establishments', __name__)

# ADD NEW ESTABLISHMENT
@establishment_routes.route('<int:establishment_id>', methods=['GET'])
def get_establishment(establishment_id):
    user_id = current_user.id
    establishment = db.session.query(Establishment).get(establishment_id)
    if not establishment:
        return {"errors": ["establishment with this id does not exist"]}, 400
    if user_id != establishment.user_id:
        return {"errors": ["current user is not establishment owner"]}, 400
    return establishment.to_dict(), 200


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

@establishment_routes.route('sections/new', methods=['POST'])
def create_new_sections():
    new_section = Section(
        name = "test",
        establishment_id = 1,
        schedule = {}
    )
    db.session.add(new_section)
    db.session.commit()
    return {"result": "successfully created section(s)"}, 200

@establishment_routes.route('sections/edit', methods=["PUT"])
def edit_sections():
    return {"result": "successfully created section(s)"}, 200

@establishment_routes.route('sections/<int:section_id>/delete', methods=['DELETE'])
def delete_section(section_id):
    # must have login check to ensure server doesn't crash
    establishment_id = 1
    section_to_delete = db.session.query(Section).get(section_id)
    if section_to_delete and section_to_delete.establishment_id == establishment_id:
        db.session.delete(section_to_delete)
        db.session.commit()
        return {"result": f"successfully deleted section with id {section_id}"}, 200
    return {"errors": [f"there was an error deleting section {section_id}"]}, 400
