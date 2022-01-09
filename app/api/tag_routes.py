from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Tag, db, reservation_tags
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
        for tag in list_of_tags:
            lowercase_tag = tag.lower()
            try:
                tag_exists = db.session.query(Tag).filter(Tag.name == lowercase_tag).one_or_none()
                if tag_exists:
                    reservation_tags.insert().values(reservation_id=reservation_id, tag_id=tag_exists.id)
                else:
                    new_tag = Tag(name=lowercase_tag)
                    db.session.add(new_tag)
                    db.session.commit()
                    reservation_tags.insert().values(reservation_id=reservation_id, tag_id=new_tag.id)
            except:
                return {"errors": ["there was an error adding your tag to the database. please try again"]}, 400
        return {"result": 'succsesfully applied tags'}
    return {"errors": ["the length of one or more of your declared tags is greater than 40 characters. please be sure each tag is seperated by a space"]}, 400
