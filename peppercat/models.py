from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash

db = SQLAlchemy()

### USERS/GAMES ###
users_games = db.Table('users_games',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('game_id', db.Integer, db.ForeignKey('games.id'))
)

### USER ###
class User(db.Model):
	__tablename__ = 'users'

	id       = db.Column(db.Integer, primary_key = True)
	email    = db.Column(db.String(), unique = True)
	username = db.Column(db.String(), unique = True)
	password = db.Column(db.String())

	games = db.relationship('Game', secondary=users_games, backref=db.backref('users', lazy='dynamic'))

	def __init__(self, email, username, password):
		self.email    = email.lower()
		self.username = username.lower()
		self.set_password(password)

	def set_password(self, password):
		self.password = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password, password)

### GAME ###
class Game(db.Model):
	__tablename__ = 'games'

	id            = db.Column(db.Integer, primary_key = True)
	name          = db.Column(db.String())
	date          = db.Column(db.DateTime())
	private       = db.Column(db.Boolean())
	current_scene = db.Column(db.Integer, db.ForeignKey('gamedata.id'))

	def __init__(self, name, date, private, current_scene):
		from datetime import datetime
		self.name          = name
		self.date          = datetime.utcnow()
		self.private       = private
		self.current_scene = current_scene

### GAMEDATA ###
class GameData(db.Model):
	__tablename__ = 'gamedata'

	id       = db.Column(db.Integer, primary_key = True)
	mapdata  = db.Column(db.String())
	entities = db.Column(db.String())
	sprites  = db.Column(db.String())

	def __init__(self, mapdata, entities, sprites):
		self.mapdata  = mapdata
		self.entities = entities
		self.sprites  = sprites