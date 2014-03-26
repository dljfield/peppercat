from peppercat import app
from flask import request, render_template, send_from_directory, flash, session, url_for, redirect, jsonify
from forms import LoginForm, RegisterForm
from models import db, User, Game, GameData

@app.route('/')
def index():
	return render_template('index.html')

#############
### LOGIN ###
#############

# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()

	if request.method == 'GET':
		return render_template('login.html', form=form)

	elif request.method == 'POST':
		if form.validate() == False:
			return render_template('login.html', form=form)
		else:
			session['email'] = form.email.data
			return redirect(url_for('gamelist'))

# Logout
@app.route('/logout')
def logout():
	if 'email' not in session:
		return redirect(url_for('index'))

	session.pop('email', None)
	return redirect(url_for('index'))

# Register
@app.route('/register', methods=['GET', 'POST'])
def register():
	form = RegisterForm()

	if request.method == 'GET':
		return render_template('register.html', form = form)

	elif request.method == 'POST':
		if form.validate() == False:
			return render_template('register.html', form = form)
		else:
			newuser = User(form.email.data, form.username.data, form.password.data)
			db.session.add(newuser)
			db.session.commit()

			session['email'] = newuser.email

			return redirect(url_for('game'))


############
# GAMELIST #
############

# list of games
@app.route('/game')
def gamelist():
	if 'email' not in session:
		return redirect(url_for('login'))

	gamelist = User.query.filter_by(email = session['email']).first().games
	return render_template('gamelist.html', gamelist = gamelist)


############
### GAME ###
############

# The actual game
@app.route('/game/<path:game>')
def game(game):
	if 'email' not in session:
		return redirect(url_for('login'))

	game = Game.query.filter_by(id = game).first()
	session['current_scene'] = game.current_scene

	return render_template('game.html', game = game)


@app.route('/scene/')
def session_scene():
	if 'email' not in session:
		return "SWAG"

	print "WHAT WHAT"
	results = GameData.query.filter_by(id = session['current_scene']).all()

	json_results = None
	for result in results:
		json_results = {"size": result.size, "mapdata": result.mapdata, "entities": result.entities, "sprites": result.sprites}

	return jsonify(json_results)

# Gettin a scene
@app.route('/scene/<path:scene>')
def scene(scene):
	if 'email' not in session:
		return "SWAG"

	print "BOO BOO"
	results = GameData.query.filter_by(id = scene).first()

	json_results = None
	for result in results:
		json_results = {"mapdata": result.mapdata, "entities": result.entities, "sprites": result.sprites}

	return jsonify(json_results)

#####################################################################

# TEST
@app.route('/testdb')
def testdb():
	from models import db
	if db.session.query("1").from_statement("SELECT 1").all():
	    return 'It works.'
	else:
		return 'Something is broken.'


## There is probably a cleaner way to grab the user's name than an ajax request for this
@app.route('/user')
def getuser():
	if 'email' in session:
		return User.query.filter_by(email = session['email'].lower()).first().username