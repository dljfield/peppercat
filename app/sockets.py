from app import socketio
from flask.ext.socketio import emit

@socketio.on('player_move', namespace = '/game')
def player_move(data):
	data['type'] = 'server'
	emit('player_move', data, broadcast = True)

@socketio.on('test_move', namespace = '/game')
def test_move(data):
	data['type'] = 'server'
	data['id'] = 'player_2'
	data['position'] = { "x": 5, "y": 5 }

	emit('player_move', data, broadcast = True)