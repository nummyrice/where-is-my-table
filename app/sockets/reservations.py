import socketio

def distribute_new_res(data, establishment_id):
    socketio.emit("new_reservation", data, to=establishment_id, broadcast=True)
