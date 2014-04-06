from peppercat import app
from flask import request, render_template, send_from_directory, flash, session, url_for, redirect, jsonify
from models import db, User, Game, Scene, Entity, Terrain, Sprite

running_games = {}

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
			session['user_id']  = User.query.filter_by(email = session['email']).first().id
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
			session['user_id']  = newuser.id

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

@app.route('/game/join/<path:id>')
def join_game(id):
	# load game data
	game = Game.query.filter_by(id = id).first()
	scene = game.current_scene

	# check for a spot that is available
	location = {"x": 5, "y": 5}
	entities = Entity.query.filter_by(scene = scene).all()
	for entity in entities:
		while entity.x == location['x'] and entity.y == location['y']:
			if entity.x == location['x']:
				location['x'] = location['x'] + 1
			elif entity.y == location['y']:
				location['y'] = location['y'] + 1

	# place new player entity in that spot
	db.session.add(Entity("character", "Test Player", session['username'], location['x'], location['y'], 0, 64, True, 4, scene))
	db.session.commit()

	user = User.query.filter_by(email = session['email']).first()
	user.games.append(game)
	db.session.commit()

	# redirect the new player to the game client
	return redirect(url_for('game', game = id))

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
		terrain = '[["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"],["1","1","1","1","1","1","1","1","1","1","1"]]'
		spritelist = '[1]'

		db.session.add(Terrain(terrain, spritelist, newscene.id))

		# Create the entities
		db.session.add(Entity("object", "wall_01", None, 5, 10, 0, 158, True, 2, newscene.id))
		db.session.add(Entity("object", "wall_02", None, 5, 4, 0, 158, True, 2, newscene.id))
		db.session.add(Entity("character", "Test Character", null, 5, 5, 0, 64, True, 3, scene))

		# Create a new game
		from datetime import datetime
		user = User.query.filter_by(email = session['email']).first()
		newgame = Game(form.name.data, datetime.utcnow(), False, newscene.id, user.id)
		db.session.add(newgame)

		# Commit the stuff
		db.session.commit()

		# associate the game with the user
		user.games.append(newgame)
		db.session.commit()

		return redirect(url_for('game', game = newgame.id))

@app.route('/game/public')
def public_games():
	# show public game selection screen
	public_games = Game.query.filter_by(private = False).all()
	return render_template('public_games.html', gamelist = public_games)

############
### GAME ###
############

# The actual game
@app.route('/game/<path:id>')
def game(id):
	if 'email' not in session:
		return redirect(url_for('login'))

	game = Game.query.filter_by(id = id).first()
	session['current_scene'] = game.current_scene

	import game, Queue
	if id not in running_games:

		scene = Game.query.filter_by(id = id).first().current_scene
		entities = Entity.query.filter_by(scene = scene).all()

		queue = Queue.Queue()
		running_games[id] = {'game': game.GameLoop({'id': session['user_id'], 'username': session['username']}, entities, scene, queue), 'queue': queue}
		running_games[id]['game'].start()
	else:
		running_games[id]['queue'].put({'type': "add_user", 'input': {'id': session['user_id'], 'username': session['username']}})

	return render_template('game.html', game = game)

@app.route('/stop/<path:id>')
def stopGame(id):
	if id in running_games:
		running_games[id]['queue'].put({'type': "stop", 'input': True})
		return "Game Stopped"

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
		if Game.query.filter_by(game_master = session['user_id']).first():
			return jsonify({"user": session['username'], "type": "game_master"})
		else:
			return jsonify({"user": session['username'], "type": "player"})