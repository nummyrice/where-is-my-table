from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Establishment, Timezone, Section, Table
from app.forms import NewEstablishmentForm, EditEstablishmentForm, NewSectionForm, EditSectionForm, NewTableForm, EditTableForm
from .auth_routes import validation_errors_to_error_messages

establishment_routes = Blueprint('establishments', __name__)

@establishment_routes.route('<int:establishment_id>', methods=['GET'])
def get_establishment(establishment_id):
    user_id = current_user.id
    establishment = db.session.query(Establishment).get(establishment_id)
    if not establishment:
        return {"errors": ["establishment with this id does not exist"]}, 400
    if user_id != establishment.user_id:
        return {"errors": ["current user is not establishment owner"]}, 400
    return establishment.to_dict(), 200

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

@establishment_routes.route('edit', methods=['PUT'])
def edit_establishment():
    form = EditEstablishmentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            target_establishment = db.session.query(Establishment).get(form.data['id'])
            if target_establishment.user_id != current_user.id:
                return {"errors": ["user does not have authorization to edit restaurant details"]}, 400
            target_establishment.name = form.data['name']
            target_establishment.daylight_savings = form.data['daylight_savings']
            db.session.commit()
            return target_establishment.to_dict(), 200
        except:
            return {"errors": ["failed to update restaurant"]}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('timezones', methods=['GET'])
def get_timezones():
    timezones = db.session.query(Timezone).all()
    return {"timezones": [timezone.to_dict() for timezone in timezones]}, 200

@establishment_routes.route('sections/new', methods=['POST'])
def create_new_sections():
    form = NewSectionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_section = Section(
            name = form.data['name'],
            establishment_id = form.data['establishment_id'],
            schedule = form.data['schedule']
        )
        try:
            db.session.add(new_section)
            db.session.commit()
            return new_section.to_dict(), 201
        except:
            return {'errors': ["sections/new: database connection error"]}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('sections/edit', methods=["PUT"])
def edit_sections():
    form = EditSectionForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        section_to_update = db.session.query(Section).get(form.data['id'])
        if not section_to_update:
            return {'errors': ['section not found']}, 400
        if section_to_update.establishment_id != current_user.to_dict()['establishment_id']:
            return {'errors': ['user does not have authorization to edit this section']}, 400
        section_to_update.name = form.data['name']
        section_to_update.schedule = form.data['schedule']
        try:
            db.session.commit()
            return section_to_update.to_dict(), 201
        except:
            return {'errors': ["sections/edit: database connection error"]}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('sections/<int:sectionId>', methods=['DELETE'])
def delete_section(sectionId):
    # must have login check to ensure server doesn't crash
    establishment_id = current_user.to_dict()["establishment_id"]
    section_to_delete = db.session.query(Section).get(sectionId)
    if section_to_delete and section_to_delete.establishment_id == establishment_id:
        db.session.delete(section_to_delete)
        db.session.commit()
        return {"result": f"successfully deleted section with id {sectionId}"}, 200
    return {"errors": [f"there was an error deleting section {sectionId}"]}, 400

@establishment_routes.route('tables/new', methods=['POST'])
def create_new_table():
    form = NewTableForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_table = Table(
            table_name = form.data['table_name'],
            section_id = form.data['section_id'],
            customer_view_name = form.data['customer_view_name'],
            min_seat = form.data['min_seat'],
            max_seat = form.data['max_seat']
        )
        try:
            db.session.add(new_table)
            db.session.commit()
            return new_table.to_dict(), 201
        except:
            return {'errors': ["table/new: database connection error"]}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('tables/edit', methods=['PUT'])
def edit_table():
    form = EditTableForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            table_to_update = db.session.query(Table).get(form.data['id'])
            table_to_update.table_name = form.data['table_name'],
            table_to_update.section_id = form.data['section_id'],
            table_to_update.customer_view_name = form.data['customer_view_name'],
            table_to_update.min_seat = form.data['min_seat'],
            table_to_update.max_seat = form.data['max_seat']
            db.session.commit()
            return table_to_update.to_dict(), 201
        except:
            return {'errors': ["tables/edit: database connection error"]}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@establishment_routes.route('tables/<int:table_id>', methods=["DELETE"])
def delete_table(table_id):
    table_to_delete = db.session.query(Table).get(table_id)
    if table_to_delete:
        try:
            db.session.delete(table_to_delete)
            db.session.commit()
            return {"result": f'successfully deleted table {table_id}'}, 200
        except:
            return {'errors': ['there was a database connection error while attempting make deletion']}, 400
    return {'errors': ['table to delete could not be found']}, 400
