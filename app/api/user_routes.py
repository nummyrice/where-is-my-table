from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import db, User
from app.forms import UpdateGuestForm, EditUserForm
from .auth_routes import validation_errors_to_error_messages


user_routes = Blueprint('users', __name__)

#GET USER LIST
@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


#GET USER
@user_routes.route('/<int:id>')
@login_required
def user(id):
    user = User.query.get(id)
    return user.to_dict()


#ADD GUEST
@user_routes.route('/add-guest', methods=['POST'])
def add_guest():
    form = UpdateGuestForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # create user
        new_guest = User(
            name=form.data['name'],
            email=form.data['email'],
            phone_number = form.data['phone_number'],
            notes = form.data['notes']
        )
        # add user
        db.session.add(new_guest)
        db.session.commit()
        # commit user
        return {"result": "succesfully added guest", "guest": new_guest.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400


#EDIT USER
@user_routes.route('/edit', methods=['PUT'])
def edit_user():
    form = EditUserForm()
    print('FORM DATAAAAAA: ', form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    target_user = db.session.query(User).get(form.data['id'])
    if form.data['name']:
        target_user.name = form.data['name']
    if form.data['email']:
        target_user.email = form.data['email']
    if form.data['phone_number']:
        target_user.email = form.data['phone_number']
    if form.data['notes']:
        target_user.notes = form.data['notes']
    db.session.commit()
    return {"result": "succesfully updated user", "user": target_user.to_dict()}


#DELETE USER
@user_routes.route('/delete', methods=['DELETE'])
def delete_user():
    data = request.json
    target_user = db.session.query(User).get(data['id'])
    db.session.delete(target_user)
    db.session.commit()
    return {"result": "successfully deleted user"}
