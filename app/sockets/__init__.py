from flask_socketio import SocketIO
from flask_socketio import join_room, leave_room
from .reservations import distribute_new_res

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('connect')
def test_connect(auth):
    socketio.emit('my response', {'data': 'Connected'})

@socketio.on('join')
def on_join(data):
    print('DATA______________________: ', data)
    # username = data['username']
    room = data
    join_room(room)
    # socketio.send(to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    socketio.send(username + ' has left the room.', to=room)
