from flask import Blueprint, request
from flask_login import current_user, login_required
import sqlalchemy
from app.models import db, Waitlist, Table, Establishment
from dateutil import parser
from dateutil.relativedelta import relativedelta
from app.forms import WaitlistForm, UpdateWaitlistForm
from .auth_routes import validation_errors_to_error_messages
from sqlalchemy import exc
from app.sockets import distribute_new_party, distribute_update_party, distribute_delete_party, distribute_party_status_change
from .auth_routes import validation_errors_to_error_messages
import pytz
import datetime

waitlist_routes = Blueprint('waitlist', __name__)
# GET WAITLIST NUMBER
@waitlist_routes.route('/<establishment_name>/<int:establishment_id>/waitlist-details', methods=['GET'])
def waitlist_details(establishment_name, establishment_id):
    try:
        establishment = db.session.query(Establishment).get(establishment_id)
        timezone = pytz.timezone(establishment.get_timezone())
        establishment_now = datetime.datetime.now(timezone).replace(hour=0, minute=0)
        end_time = establishment_now + relativedelta(days=1)
        todays_waitlist = db.session.query(Waitlist).filter(Waitlist.created_at.between(establishment_now, end_time),Waitlist.status_id == 5,  Waitlist.establishment_id == establishment_id).all()
        current_place = None
        max_wait = 0
        for i, party_query in enumerate(todays_waitlist):
            party = party_query.to_dict()
            if max_wait < party.estimated_wait:
                max_wait = party.estimated_wait
            if current_user:
                if party.guest_id == current_user.id:
                    current_place = i + 1
        data = {
            "waitlist_count": len(todays_waitlist),
            "estimated_wait": max_wait,
            "place": current_place
        }


        return data, 200
    except:
        return {"errors": ["there was an error getting waitlist data"]}, 400
#

# GET WAITLIST
@waitlist_routes.route('/selected-date', methods=['POST'])
def selected_date_waitlist():
    data = request.json
    establishment_id = current_user.establishment.id
    selected_date = parser.isoparse(data['selected_date'])
    end_datetime = selected_date + relativedelta(days=1)
    waitlist = db.session.query(Waitlist).filter(Waitlist.created_at.between(selected_date, end_datetime), Waitlist.establishment_id == establishment_id).all()
    if len(waitlist):
        return {"waitlist": [entry.to_dict() for entry in waitlist]}
    return {"waitlist": []}

# NEW PARTY
@waitlist_routes.route('/new', methods=['POST'])
def new_party():
    form = WaitlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            newParty = Waitlist(
                guest_id = form.data['guest_id'],
                party_size = form.data['party_size'],
                estimated_wait = form.data['estimated_wait'],
                status_id = 5,
                establishment_id = current_user.establishment.id
            )
            db.session.add(newParty)
            db.session.commit()
            distribute_new_party(newParty.to_dict(), f'establishment_{newParty.establishment_id}')
            return newParty.to_dict(), 201
        except exc.SQLAlchemyError as e:
            return {'errors': ['server error uploading to database']}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# EDIT PARTY
@waitlist_routes.route('/update', methods=['PUT'])
def update_party():
    form = UpdateWaitlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            updated_party = db.session.query(Waitlist).get(form.data['id'])
            updated_party.guest_id = form.data['guest_id']
            updated_party.party_size = form.data['party_size']
            updated_party.estimated_wait = form.data['estimated_wait']
            db.session.commit()
            distribute_update_party(updated_party.to_dict(), f'establishment_{updated_party.establishment_id}')
            return updated_party.to_dict(), 201
        except:
            return {'errors': ['server error uploading to database']}, 400
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# UPDATE PARTY STATUS
@waitlist_routes.route('/status/update', methods=['PUT'])
def edit_status():
    data = request.json
    try:
        party = db.session.query(Waitlist).get(data['party_id'])
        party.status_id = data['status_id']
        db.session.commit()
        distribute_party_status_change(party.to_dict(), f'establishment_{party.establishment_id}')
        return {"result": "successfully updated party status", "party": party.to_dict()}
    except:
        return {"errors": ["there was a server error updating the party status"]}, 400

# DELETE PARTY STATUS
@waitlist_routes.route('/<int:partyId>remove', methods=['DELETE'])
def delete_party(partyId):
    try:
        party = db.session.query(Waitlist).get(partyId)
        establishment_id = party.establishment_id
        db.session.delete(party)
        db.session.commit()
        distribute_delete_party(partyId, f'establishment_{establishment_id}')
        return {'result': 'successfully deleted party'}, 200
    except:
        return {'errors': ["there was a server error deleting the party"]}, 400
