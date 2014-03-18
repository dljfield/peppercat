from peppercat import app
from flask import request, render_template, send_from_directory, flash
from forms import LoginForm, RegisterForm

#############
### LOGIN ###
#############

# Show login form
@app.route('/')
def index():
	form = LoginForm()
	return render_template('index.html', form = form)

# Login logic
@app.route('/login')
def login():
	pass

@app.route('/register', methods=['GET', 'POST'])
def register():
	form = RegisterForm()

	if request.method == 'GET':
	    return render_template('register.html', form = form)

	elif request.method == 'POST':
		if form.validate() == False:
			return render_template('register.html', form = form)
		else:
			return "[1] Create a new user [2] sign in the user [3] redirect to the user's profile"

############
### GAME ###
############

# The actual game
@app.route('/game')
def game():
	return render_template('game.html')

# Gettin a scene
@app.route('/scene/<path:scene>')
def scene(scene):
	return send_from_directory(app.config['SCENES'], scene + '.json')


# TEST
@app.route('/testdb')
def testdb():
	from models import db
	if db.session.query("1").from_statement("SELECT 1").all():
	    return 'It works.'
	else:
		return 'Something is broken.'