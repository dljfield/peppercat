from peppercat import app
from flask import render_template, send_from_directory
from forms import LoginForm

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

@app.route('/register')
def register():
	pass

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