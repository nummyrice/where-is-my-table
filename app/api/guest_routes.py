from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from app.forms import NewGuestForm, UpdateGuestForm
from .auth_routes import validation_errors_to_error_messages

guest_routes = Blueprint('guests', __name__)

# GET GUESTS
@guest_routes.route('', methods=['POST'])
# @login_required
def search_guests():
    data = request.json
    try:
        results = User.query.filter(or_(User.name.ilike(f"%{data['search_string']}%"), User.phone_number.ilike(f"%{data['search_string']}%"))).all()
        return {"searchResults": [guest.to_safe_dict() for guest in results]}
    except:
        return {"error": "error retrieving guest data"}, 400

# ADD GUEST
@guest_routes.route('add', methods=['POST'])
# @login_required
def add_guest():
    form = NewGuestForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # create user
        new_guest = User(
            name=form.data['name'],
            email=form.data['email'],
            phone_number = form.data['phone_number'],
            notes = form.data['notes']
        )
        # print('NEW GUEST_______: ', new_guest, form.data['email'], form.data['notes'], form.data['phone_number'])
        try:
        # add user
            db.session.add(new_guest)
            db.session.commit()
        except SQLAlchemyError as e:
            error = str(e.__dict__['orig'])
            print("Error: ", error)
            return {'errors': ['server error adding guest user, please try again']}, 400
        # commit user
        return {"result": "succesfully added guest", "guest": new_guest.to_safe_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# UPDATE GUEST
@guest_routes.route('update', methods=['PUT'])
# @login_required
def update_guest():
    form = UpdateGuestForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            user_to_update = db.session.query(User).get(form.data['id'])
            if form.data['name']:
                user_to_update.name = form.data['name']
            if form.data['email']:
                user_to_update.email = form.data['email']
            if form.data['phone_number']:
                user_to_update.phone_number = form.data['phone_number']
            if form.data['notes']:
                user_to_update.notes = form.data['notes']
            db.session.commit()
            return {"result": "succesffully updated guest info", "guest": user_to_update.to_safe_dict()}
        except:
            return {"errors": ['server error getting user to update, please try again']}, 400
    return {"errors": validation_errors_to_error_messages(form.errors)}, 400
