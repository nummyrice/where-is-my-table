from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Waitlist, Table
from dateutil import parser
from dateutil.relativedelta import relativedelta
from app.forms import WaitlistForm, UpdateWaitlistForm
from .auth_routes import validation_errors_to_error_messages



from .auth_routes import validation_errors_to_error_messages

waitlist_routes = Blueprint('waitlist', __name__)

@waitlist_routes.route('/selected-date', methods=['POST'])
def selected_date_waitlist():
    data = request.json
    selected_date = parser.isoparse(data['selected_date'])
    end_datetime = selected_date + relativedelta(days=1)
    waitlist = db.session.query(Waitlist).filter(Waitlist.created_at.between(selected_date, end_datetime)).all()
    if len(waitlist):
        return {"waitlist": [entry.to_dict() for entry in waitlist]}
    return {"waitlist": []}

# NEW PARTY
@waitlist_routes.route('/new', methods=['POST'])
def new_party():
    form = WaitlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        newParty = Waitlist(
            guest_id = form.data['guest_id'],
            party_size = form.data['party_size'],
            estimated_wait = form.data['estimated_wait'],
            status_id = 5,
        )
        db.session.add(newParty)
        db.session.commit()
        return {'result': 'successfully added party', "party": newParty.to_dict()}
    print('MADE IT', validation_errors_to_error_messages(form.errors))
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# EDIT PARTY
@waitlist_routes.route('/update', methods=['PUT'])
def update_party():
    form = UpdateWaitlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        updated_party = db.session.query(Waitlist).get(form.data['waitlist_id'])
        updated_party.guest_id = form.data['guest_id']
        updated_party.party_size = form.data['party_size']
        updated_party.estimated_wait = form.data['estimated_wait']
        db.session.commit()
        return { "result": "successfully updated waitlist", "party": updated_party.to_dict()}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# UPDATE PARTY STATUS
@waitlist_routes.route('/status/update', methods=['PUT'])
def edit_status():
    data = request.json
    try:
        party = db.session.query(Waitlist).get(data['party_id'])
        party.status_id = data['status_id']
        db.session.commit()
        return {"result": "successfully updated party status", "party": party.to_dict()}
    except:
        return {"errors": "there was a server error updating the party status"}, 400

# DELETE PARTY STATUS
@waitlist_routes.route('/<int:partyId>remove', methods=['DELETE'])
def delete_party(partyId):
    try:
        party = db.session.query(Waitlist).get(partyId)
        db.session.delete(party)
        return {'result': 'successfully deleted party'}
    except:
        return {'errors': "there was a server error deleting the party"}, 400
