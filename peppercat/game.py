import threading, Queue, time

from peppercat import routes

UPDATE_INTERVAL = (1.0 / 30)

class GameLoop(threading.Thread):

	def __init__(self, entities = None, scene = None, input_queue = None, reply_queue = None):
		print "Starting up a game loop."

		super(GameLoop, self).__init__()
		self.input_queue = input_queue
		self.reply_queue = reply_queue

		self.scene = scene
		self.entities = {}

		for entity in entities:
			self.entities[entity.id] = Entity(entity.id, entity.user, entity.x, entity.y)

		self.users = {}

		self.refreshed_users = {}

		self.alive = threading.Event()
		self.alive.set()

	def run(self):
		self.previous_time = time.time()
		self.lag = 0

		while self.alive.isSet():
			self.update()

	def update(self):
		current_time = time.time()
		elapsed_time = current_time - self.previous_time
		self.previous_time = current_time
		self.lag += elapsed_time

		while self.lag >= UPDATE_INTERVAL:
			input = self.getInput()

			self.lag -= UPDATE_INTERVAL

			if input and input['type'] == 'get_entities':
				self.returnEntities()

			elif input and input['type'] == 'add_user':
				self.playerAdd(input)

			elif input and input['type'] == 'player_disconnect':
				self.playerDisconnect(input)
				break

			elif input and input['type'] == "stop" and input['input'] == True:
				self.shutDown()
				break

			else:
				self.updateEntities(input)

	def getInput(self):
		try:
			input = self.input_queue.get(True, 0.01)
			return input
		except Queue.Empty as e:
			return None

	def updateEntities(self, input):
		for entity in self.entities:
			self.entities[entity].update(input)

	def playerAdd(self, input):
		print "Adding user: " + input['input']['username']

		if input['input']['id'] in self.users:
			# The user refreshed the page or otherwise reconnected
			# so we need to keep track of that fact
			# or else the game might wrongly end itself when the
			# disconnect event comes through
			print "The user already exists. Added to refreshed user list."
			if input['input']['id'] in self.refreshed_users:
				print "Multiple refreshes."
				self.refreshed_users[input['input']['id']] += 1
			else:
				print "First refresh."
				self.refreshed_users[input['input']['id']] = 1
		else:
			self.users[input['input']['id']] = {'username': input['input']['username'], 'game_master': False}

	def playerDisconnect(self, input):
		if input['input'] in self.refreshed_users:
			# the user refreshed the page so they haven't really disconnected
			print "The user has refreshed, not a real disconnect."
			self.refreshed_users[input['input']] -= 1
			if self.refreshed_users[input['input']] <= 0:
				print "Reached last refresh for user."
				del self.refreshed_users[input['input']]
		elif input['input'] in self.users:
			del self.users[input['input']]
			if not self.users:
				self.shutDown()

	def shutDown(self):
		for entity in self.entities:
			self.entities[entity].shutDown()

		self.alive.clear()
		print "Persisting game."
		self.persist()
		print "Stopping thread."
		self.reply_queue.put("shutdown")

	def persist(self):
		from models import db, Entity
		from peppercat import app

		with app.app_context():
			for entity in self.entities:
				current_entity = Entity.query.filter_by(id = self.entities[entity].id).first()

				current_entity.x = self.entities[entity].x
				current_entity.y = self.entities[entity].y

				db.session.commit()

	def returnEntities(self):
		entity_list = {}
		for entity in self.entities:
			the_entity = self.entities[entity]
			entity_json = {"user_id": the_entity.user_id, "x": the_entity.x, "y": the_entity.y, "path": the_entity.path, "destination": the_entity.destination}
			entity_list[entity] = entity_json

		print "Returning entities."
		self.reply_queue.put(entity_list)

class Entity():
	id = None
	user_id = None
	x = None
	y = None
	path = None
	destination = None
	speed = 0.125

	def __init__(self, entity_id, user_id, x, y):
		self.id = entity_id
		self.user_id = user_id
		self.x  = x
		self.y  = y

	def update(self, input):
		processed_input = self.processInput(input)
		self.updatePathing(processed_input)
		self.updateDestination()
		self.updatePosition()

	def shutDown(self):
		if self.destination:
			self.x = self.destination['x']
			self.y = self.destination['y']
			self.destination = None

	def processInput(self, input):
		if input is not None and input['input']['entity_id'] and input['input']['entity_id'] == self.id:
			return input
		else:
			return None

	def updatePathing(self, input):
		if input is not None and input['type'] == 'player_move':
			self.path = input['input']['path']

	def updateDestination(self):
		if not self.destination and self.path:
			self.destination = self.path.pop(0)

		elif self.destination and (self.destination['x'] and self.x == self.destination['x']) and (self.destination['y'] and self.y == self.destination['y']):
			if self.path:
				self.destination = self.path.pop(0)
			else:
				self.destination = None

	def updatePosition(self):
		if self.destination:
			if self.x < self.destination['x']:
				if self.destination['x'] - self.x <= self.speed:
					self.x = self.destination['x']
				else:
					self.x += self.speed
			elif self.x > self.destination['x']:
				if self.x - self.destination['x'] <= self.speed:
					self.x = self.destination['x'];
				else:
					self.x -= self.speed;

			if self.y < self.destination['y']:
				if self.destination['y'] - self.y <= self.speed:
					self.y = self.destination['y']
				else:
					self.y += self.speed
			elif self.y > self.destination['y']:
				if self.y - self.destination['y'] <= self.speed:
					self.y = self.destination['y']
				else:
					self.y -= self.speed