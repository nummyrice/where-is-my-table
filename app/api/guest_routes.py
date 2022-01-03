from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError

guest_routes = Blueprint('guests', __name__)

# GET GUESTS
@guest_routes.route('', methods=['POST'])
# @login_required
def search_guests():
    data = request.json
    results = User.query.filter(or_(User.name.ilike(f"%{data['search_string']}%"), User.phone_number.ilike(f"%{data['search_string']}%"))).all()
    return {"searchResults": [guest.to_safe_dict() for guest in results]}


@guest_routes.route('add', methods=['POST'])
def add_guest():
    data = request.json
    newUser = User(
        name=data['name'],
        phoneNumber=data['']
    )



@guest_routes.route('update', method=['PUT'])
def update_guest():
    data = request
