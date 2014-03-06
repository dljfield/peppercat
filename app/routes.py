from app import app, socketio
from flask import render_template, send_from_directory
from flask.ext.socketio import emit

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/scene/<path:scene>')
def scene(scene):
	return send_from_directory(app.config['SCENES'], scene + '.json')

@socketio.on('test_message', namespace='/test')
def test_message(message):
	emit('test_response', {'data': 'what'})