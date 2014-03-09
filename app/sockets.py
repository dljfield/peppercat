from app import socketio
from flask.ext.socketio import emit

@socketio.on('player_move', namespace = '/game')
def player_move(data):
	data['type'] = "server"
	emit('player_move', data, broadcast = True)