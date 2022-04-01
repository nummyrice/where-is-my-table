from flask_socketio import SocketIO
from flask_socketio import join_room, leave_room
# from .reservations import distribute_new_res

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('connect')
# def test_connect(auth):
#     socketio.emit('my response', {'data': 'Connected'})

@socketio.on('join')
def on_join(data):
    room = data
    join_room(room)
    socketio.emit('status', {"msg": "SUCCESSFULLY JOINED THE ROOM"}, room=room)
    # socketio.send(to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    socketio.send(username + ' has left the room.', to=room)

def distribute_new_res(new_res, establishment_id):
    socketio.emit("new_reservation", new_res, to=establishment_id)

def distribute_update_res(updated_res, establishment_id):
    socketio.emit("update_reservation", updated_res, to=establishment_id)

def distribute_remove_res_tag(data, establishment_id):
    socketio.emit("remove_tag", data, to=establishment_id)

def distribute_new_party(new_party, establishment_id):
    socketio.emit("new_party", new_party, to=establishment_id)

def distribute_update_party(updated_party, establishment_id):
    socketio.emit("update_party", updated_party, to=establishment_id)

def distribute_remove_party_tag(party_id, tag_id, establishment_id):
    socketio.emit('remove_party_tag', {"party_id": party_id, "tag_id": tag_id}, to=establishment_id)
