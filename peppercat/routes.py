from peppercat import app
from flask import request, render_template, send_from_directory, flash, session, url_for, redirect, jsonify
from models import db, User, Game, Scene, Entity, Terrain, Sprite

@app.route('/')
def index():
	return render_template('index.html')

#############
### LOGIN ###
#############

# Login
@app.route('/login', methods=['GET', 'POST'])
def login():
	from forms import LoginForm
	form = LoginForm()

	if request.method == 'GET':
		return render_template('login.html', form=form)

	elif request.method == 'POST':
		if form.validate() == False:
			return render_template('login.html', form=form)
		else:
			session['email']    = form.email.data
			session['username'] = User.query.filter_by(email = session['email']).first().username
			return redirect(url_for('gamelist'))

# Logout
@app.route('/logout')
def logout():
	if 'email' not in session:
		return redirect(url_for('index'))

	session.pop('email', None)
	session.pop('username', None)
	return redirect(url_for('index'))

# Register
@app.route('/register', methods=['GET', 'POST'])
def register():
	from forms import RegisterForm
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

			session['email']    = newuser.email
			session['username'] = newuser.username

			return redirect(url_for('gamelist'))


############
# GAMELIST #
############

# list of games
@app.route('/game')
def gamelist():
	if 'email' not in session:
		return redirect(url_for('login'))

	gamelist = User.query.filter_by(email = session['email']).first().games
	return render_template('gamelist.html', gamelist = gamelist, user = session['username'])

@app.route('/game/join', methods=['GET', 'POST'])
def join_game():
	if request.method == 'GET':
		# show public game selection screen
		public_games = Game.query.filter_by(private = False).all()
		return render_template('join_game.html', gamelist = public_games)

	elif request.method == 'POST':
		pass
		# load game data
		# check for a spot that is available
		# place new player entity in that spot
		# redirect the new player to the game client

@app.route('/game/create', methods=['GET', 'POST'])
def create_game():
	from forms import CreateGameForm
	form = CreateGameForm()

	if request.method == 'GET':
		return render_template('create_game.html', form = form)

	elif request.method == 'POST':

		# Create a new scene
		newscene = Scene()
		db.session.add(newscene)
		db.session.commit() # we need the ID

		# Create the terrain
		terrain = '[["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1"]]'
		spritelist = '[1]'

		db.session.add(Terrain(terrain, spritelist, newscene.id))

		# Create the entities
		db.session.add(Entity("character", "Test Character", session['username'], 5, 5, 0, 64, True, 2, newscene.id))
		db.session.add(Entity("object", "wall_01", session['username'], 5, 7, 0, 158, True, 3, newscene.id))

		# Create a new game
		from datetime import datetime
		newgame = Game(form.name.data, datetime.utcnow(), False, newscene.id)
		user = User.query.filter_by(email = session['email']).first()
		db.session.add(newgame)

		# Commit the stuff
		db.session.commit()

		# associate the game with the user
		user = User.query.filter_by(email = session['email']).first()
		user.games.append(newgame)
		db.session.commit()

		return redirect(url_for('game', game = newgame.id))

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

	results = Scene.query.filter_by(id = session['current_scene']).all()

	json_results = None
	for result in results:
		sprite_list = {}
		entities = []
		for entity in result.entities:
			db_sprite = Sprite.query.filter_by(id = entity.sprite).first()
			sprite_list[db_sprite.id] = db_sprite.sprite
			entities.append({"id": entity.id, "type": entity.type, "user": entity.user, "x": entity.x, "y": entity.y, "z": entity.z, "height": entity.height, "collidable": entity.collidable, "sprite": entity.sprite})

		terrain = None
		for terrain_obj in result.terrain:
			terrain = terrain_obj.mapdata
			import json
			decoded = json.loads(terrain_obj.sprite_list)

			for sprite in decoded:
				db_sprite = Sprite.query.filter_by(id = sprite).first()
				sprite_list[db_sprite.id] = db_sprite.sprite

		json_results = {"terrain": terrain, "entities": entities, "sprites": sprite_list}

	return jsonify(json_results)

# Gettin a scene
@app.route('/scene/<path:scene>')
def scene(scene):
	if 'email' not in session:
		return "SWAG"

	results = GameData.query.filter_by(id = scene).first()

	json_results = None
	for result in results:
		json_results = {"mapdata": result.mapdata, "entities": result.entities, "sprites": result.sprites}

	session['current_scene'] = results.scene.id

	return jsonify(json_results)

#####################################################################


## There is probably a cleaner way to grab the user's name than an ajax request for this
@app.route('/user')
def getuser():
	if 'username' in session:
		return session['username']