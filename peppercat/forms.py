from flask_wtf import Form
from wtforms import TextField, PasswordField, SubmitField
from wtforms.validators import Required, Email, ValidationError
from models import db, User

class LoginForm(Form):
	user     = TextField('Username / Email', validators=[Required("Please enter a username or email.")])
	password = PasswordField('Password', validators=[Required("Please enter a password.")])

class RegisterForm(Form):
	email    = TextField('Email', validators=[Required("Please enter your email address."), Email("Please enter a valid email address.")])
	username = TextField('Username', validators=[Required("Please enter a username.")])
	password = PasswordField('Password', validators=[Required("Please enter a password.")])

	submit = SubmitField("Create account")

	def __init__(self, *args, **kwargs):
		Form.__init__(self, *args, **kwargs)

	def validate(self):
		if not Form.validate(self):
			return False

		if User.query.filter_by(email = self.email.data.lower()).first():
			self.email.errors.append("That email is already in use.")
			return False
		elif User.query.filter_by(username = self.username.data.lower()).first():
			self.email.errors.append("That username is already in use.")
			return False
		else:
			return True