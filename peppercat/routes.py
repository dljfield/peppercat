from peppercat import app
from flask import request, render_template, send_from_directory, flash, session, url_for, redirect
from forms import LoginForm, RegisterForm
from models import db, User

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

			return redirect(url_for('gamelist'))


############
# GAMELIST #
############

# list of games
@app.route('/gamelist')
def gamelist():
	if 'email' not in session:
		return redirect(url_for('login'))

	gamelist = User.query.filter_by(email = session['email']).first().games

	return render_template('gamelist.html', gamelist = gamelist)


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
	if 'email' not in session:
		return "SWAG"
	else:
		return send_from_directory(app.config['SCENES'], scene + '.json')

#####################################################################

# TEST
@app.route('/testdb')
def testdb():
	from models import db
	if db.session.query("1").from_statement("SELECT 1").all():
	    return 'It works.'
	else:
		return 'Something is broken.'

@app.route('/user')
def getuser():
	if 'email' in session:
		user = User.query.filter_by(email = session['email'].lower()).first()
		return user.username