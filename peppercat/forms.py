from flask_wtf import Form
from wtforms import TextField, PasswordField, SubmitField
from wtforms.validators import Required, Email, ValidationError
from models import db, User

class LoginForm(Form):
	email    = TextField('Email', validators=[Required("Please enter an email address."), Email("Please enter a valid email address.")])
	password = PasswordField('Password', validators=[Required("Please enter a password.")])
	submit   = SubmitField("Log In")

	def __init__(self, *args, **kwargs):
		Form.__init__(self, *args, **kwargs)

	def validate(self):
		if not Form.validate(self):
			return False

		user = User.query.filter_by(email = self.email.data.lower()).first()
		if user and user.check_password(self.password.data):
			return True
		else:
			self.email.errors.append("Invalid e-mail or password")
			return False

class RegisterForm(Form):
	email    = TextField('Email', validators=[Required("Please enter your email address."), Email("Please enter a valid email address.")])
	password = PasswordField('Password', validators=[Required("Please enter a password.")])
	submit   = SubmitField("Create account")

	def __init__(self, *args, **kwargs):
		Form.__init__(self, *args, **kwargs)

	def validate(self):
		if not Form.validate(self):
			return False

		if User.query.filter_by(email = self.email.data.lower()).first():
			self.email.errors.append("That email is already in use.")
			return False
		else:
			return True