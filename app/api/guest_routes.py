from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User
from sqlalchemy import or_

guest_routes = Blueprint('guests', __name__)

# GET GUESTS
@guest_routes.route('', methods=['POST'])
# @login_required
def search_guests():
    data = request.json
    results = User.query.filter(or_(User.name.ilike(f"%{data['search_string']}%"), User.phone_number.ilike(f"%{data['search_string']}%"))).all()
    return {"searchResults": [guest.to_safe_dict() for guest in results]}
