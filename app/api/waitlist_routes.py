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
