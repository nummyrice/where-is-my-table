from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, Waitlist, Table
from dateutil import parser
from dateutil.relativedelta import relativedelta


from .auth_routes import validation_errors_to_error_messages

waitlist_routes = Blueprint('waitlist', __name__)

@waitlist_routes.route('/selected-date', methods=['POST'])
def selected_date_waitlist():
    data = request.json
    selected_date = parser.isoparse(data['selected_date'])
    end_datetime = selected_date + relativedelta(days=1)
    waitlist = db.session.query(Waitlist).filter(Waitlist.created_at.between(selected_date, end_datetime)).all()
    print('WAITLIST +++++++++: ', [entry.to_dict() for entry in waitlist])
    return {"waitlist": [entry.to_dict() for entry in waitlist]}
