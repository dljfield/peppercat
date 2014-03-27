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

	games = db.relationship('Game', secondary = users_games, backref = db.backref('users', lazy = 'dynamic'))

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
	current_scene = db.Column(db.Integer, db.ForeignKey('scenes.id'))

	def __str__(self):
		return "<Game> " + self.name

### SCENES ###
class Scene(db.Model):
	__tablename__ = 'scenes'

	id       = db.Column(db.Integer, primary_key = True)
	size_x   = db.Column(db.Integer)
	size_y   = db.Column(db.Integer)
	terrain  = db.relationship('Terrain', backref = 'scenes', lazy = 'dynamic')
	entities = db.relationship('Entity', backref = 'scenes', lazy = 'dynamic')
	sprites  = db.Column(db.String())

	def __str__(self):
		return "<GameData> " + self.id

### ENTITIES ###
class Entity(db.Model):
	__tablename__ = 'entities'

	id         = db.Column(db.Integer, primary_key = True)
	type       = db.Column(db.String())
	name       = db.Column(db.String())
	user       = db.Column(db.Integer, db.ForeignKey('users.id'))
	x          = db.Column(db.Integer)
	y          = db.Column(db.Integer)
	z          = db.Column(db.Integer)
	height     = db.Column(db.Integer)
	collidable = db.Column(db.Boolean())
	sprite     = db.Column(db.Integer, db.ForeignKey('sprites.id'))
	game_id    = db.Column(db.Integer, db.ForeignKey('games.id'))

### TERRAIN ###
class Terrain(db.Model):
	__tablename__ = 'terrrain'

	id      = db.Column(db.Integer, primary_key = True)
	mapdata = db.Column(db.String())
	game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

### SPRITES ###
class Sprite(db.Model):
	__tablename__ = 'sprites'

	id     = db.Column(db.Integer, primary_key = True)
	sprite = db.Column(db.String())