from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
	__tablename__ = 'users'
	id       = db.Column(db.Integer, primary_key = True)
	username = db.Column(db.String(), unique = True)
	email    = db.Column(db.String(), unique = True)
	password = db.Column(db.String())

	def __init__(self, firstname, lastname, email, password):
		self.username = username.lower()
		self.email = email.lower()
		self.set_password(password)

	def set_password(self, password):
		self.password = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password, password)