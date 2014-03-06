from app import socketio
from flask.ext.socketio import emit

@socketio.on('test_message', namespace='/test')
def test_message(message):
	emit('test_response', {'data': 'what'})