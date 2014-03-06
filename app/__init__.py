import os
from flask import Flask
from flask.ext.socketio import SocketIO

app = Flask(__name__, static_folder = 'client')

app.config.update(
	DEBUG = True,
	SECRET_KEY = 'dat-secret-key',
	SCENES = os.path.dirname(__file__) + '/client/data'
)

socketio = SocketIO(app)

from app import routes, sockets