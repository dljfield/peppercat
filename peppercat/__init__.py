import os
from flask import Flask
from flask.ext.socketio import SocketIO

app = Flask(__name__, static_folder = 'client')

app.config.update(
	DEBUG = True,
	CSRF_ENABLED = True,
	SECRET_KEY = 'dat-secret-key',
	SCENES = os.path.dirname(__file__) + '/client/data'
)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data/development.sqlite3'

from models import db, User, Game, users_games
db.init_app(app)

socketio = SocketIO(app)

from peppercat import routes, sockets