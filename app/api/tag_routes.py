from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Tag, db, reservation_tags, Reservation
from app.forms import NewTagsForm
from .auth_routes import validation_errors_to_error_messages

tag_routes = Blueprint('tags', __name__)

# ADD TAGS
@ tag_routes.route('add', methods=['POST'])
# @login_required
def add_tags():
    form = NewTagsForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_id = form.data['reservation_id']
        list_of_tags = form.data['tags'].split()
        target_res = db.session.query(Reservation).get(reservation_id)
        for tag in list_of_tags:
            lowercase_tag = tag.lower()
            try:
                tag_exists = db.session.query(Tag).filter(Tag.name == lowercase_tag).one_or_none()
                if tag_exists:
                    target_res.tags.append(tag_exists)
                else:
                    new_tag = Tag(name=lowercase_tag)
                    db.session.add(new_tag)
                    db.session.commit()
                    target_res.tags.append(new_tag)
                db.session.add(target_res)
                db.session.commit()
            except:
                return {"errors": ["there was an error adding your tag to the database. please try again"]}, 400
        return {"result": 'succsesfully applied tags'}
    return {"errors": ["the length of one or more of your declared tags is greater than 40 characters. please be sure each tag is seperated by a space"]}, 400
