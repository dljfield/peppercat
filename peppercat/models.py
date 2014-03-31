from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash

db = SQLAlchemy()

users_games = db.Table('users_games',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('game_id', db.Integer, db.ForeignKey('games.id'))
)

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

class Game(db.Model):
	__tablename__ = 'games'

	id            = db.Column(db.Integer, primary_key = True)
	name          = db.Column(db.String())
	date          = db.Column(db.DateTime())
	private       = db.Column(db.Boolean())
	current_scene = db.Column(db.Integer, db.ForeignKey('scenes.id'))
	game_master   = db.Column(db.Integer, db.ForeignKey('users.id'))

	def __init__(self, name, date, private, current_scene, game_master):
		self.name          = name
		self.date          = date
		self.private       = private
		self.current_scene = current_scene
		self.game_master   = game_master

	def __str__(self):
		return "<Game> " + self.name

class Scene(db.Model):
	__tablename__ = 'scenes'

	id       = db.Column(db.Integer, primary_key = True)
	terrain  = db.relationship('Terrain', backref = 'scenes', lazy = 'dynamic')
	entities = db.relationship('Entity', backref = 'scenes', lazy = 'dynamic')

	def __str__(self):
		return "<GameData> " + self.id

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
	scene      = db.Column(db.Integer, db.ForeignKey('scenes.id'))

	def __init__(self, type, name, user, x, y, z, height, collidable, sprite, scene):
		self.type       = type
		self.name       = name
		self.user       = user
		self.x          = x
		self.y          = y
		self.z          = z
		self.height     = height
		self.collidable = collidable
		self.sprite     = sprite
		self.scene      = scene

class Terrain(db.Model):
	__tablename__ = 'terrrain'

	id          = db.Column(db.Integer, primary_key = True)
	mapdata     = db.Column(db.String())
	sprite_list = db.Column(db.String())
	scene       = db.Column(db.Integer, db.ForeignKey('scenes.id'))

	def __init__(self, mapdata, sprite_list, scene):
		self.mapdata     = mapdata
		self.sprite_list = sprite_list
		self.scene       = scene

class Sprite(db.Model):
	__tablename__ = 'sprites'

	id     = db.Column(db.Integer, primary_key = True)
	sprite = db.Column(db.String())

	def __init__(self, sprite):
		self.sprite = sprite