from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Tag, db, Reservation, Waitlist
from app.forms import NewTagsForm, NewPartyTagsForm
from .auth_routes import validation_errors_to_error_messages
from sqlalchemy import exc

tag_routes = Blueprint('tags', __name__)

# ADD TAGS
@ tag_routes.route('add-to-reservation', methods=['POST'])
# @login_required
def add_res_tags():
    form = NewTagsForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        reservation_id = form.data['reservation_id']
        list_of_tags = form.data['tags'].split(",")
        target_res = db.session.query(Reservation).get(reservation_id)
        for tag in list_of_tags:
            lowercase_tag = tag.strip().lower()
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
                # print("NEW TAG: *********************", new_tag)
            except exc.SQLAlchemyError as e:
                print('Error from ADD TAGS SERVER ROUTE ', e)
                return {"errors": ["there was an error adding your tag to the database. please try again"]}, 400
        return target_res.to_dict(), 201
    return {"errors": ["the length of one or more of your declared tags is greater than 40 characters. please be sure each tag is seperated by a comma and space"]}, 400


# REMOVE TAG
@ tag_routes.route('/<int:resId>/<int:tagId>/remove', methods=['DELETE'])
# @login_required
def remove_res_tags(resId, tagId):
    try:
        reservation = db.session.query(Reservation).get(resId)
        if (reservation):
            for idx, tag in enumerate(reservation.tags):
                if tag.id == tagId:
                    del reservation.tags[idx]
                    return {'result': "succesfully deleted tag"}, 200

            return {"errors": ["tag does not exist in target reservation"]}
    except exc.SQLAlchemyError as e:
        print('ERROR FROM REMOVE TAG ROUTE: ', e)
        return {"errors": ['reservation not found']}


# ADD  WAITLIST TAGS
@ tag_routes.route('/add-to-waitlist', methods=['POST'])
# @login_required
def add_party_tags():
    form = NewPartyTagsForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        waitlist_id = form.data['waitlist_id']
        list_of_tags = form.data['tags'].split(",")
        target_party = db.session.query(Waitlist).get(waitlist_id)
        for tag in list_of_tags:
            lowercase_tag = tag.strip().lower()
            try:
                tag_exists = db.session.query(Tag).filter(Tag.name == lowercase_tag).one_or_none()
                if tag_exists:
                    target_party.tags.append(tag_exists)
                else:
                    new_tag = Tag(name=lowercase_tag)
                    db.session.add(new_tag)
                    db.session.commit()
                    target_party.tags.append(new_tag)
                db.session.add(target_party)
                db.session.commit()
                # print("NEW TAG: *********************", new_tag)
            except exc.SQLAlchemyError as e:
                print('Error from ADD PARTY TAGS SERVER ROUTE ', e)
                return {"errors": ["there was an error adding your tag to the database. please try again"]}, 400
        return {"result": 'succsesfully applied tags', "party": target_party.to_dict()}
    return {"errors": ["the length of one or more of your declared tags is greater than 40 characters. please be sure each tag is seperated by a comma and space"]}, 400
