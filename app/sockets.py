from app import socketio
from flask.ext.socketio import emit

@socketio.on('player_move', namespace = '/game')
def player_move(data):
	emit('player_move', data, broadcast = True)