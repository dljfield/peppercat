import threading, Queue, time, datetime

from peppercat import routes

UPDATE_INTERVAL = (1.0 / 30)

class GameLoop(threading.Thread):

	def __init__(self, initial_user = None, entities = None, scene = None, input_queue = None, reply_queue = None):
		print "makin a game loop mon"

		super(GameLoop, self).__init__()
		self.input_queue = input_queue
		self.reply_queue = reply_queue

		self.scene = scene
		self.entities = {}

		for entity in entities:
			self.entities[entity.id] = Entity(entity.id, entity.user, entity.x, entity.y)

		self.users = {}
		self.users[initial_user['id']] = initial_user['username']

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
			input = None
			try:
				input = self.input_queue.get(True, 0.01)

			except Queue.Empty as e:
				pass

			self.lag -= UPDATE_INTERVAL

			if input and input['type'] == 'add_user':
				print "Adding user: " + input['input']['username']
				self.users[input['input']['id']] = input['input']['username']

			elif input and input['type'] == 'remove_user':
				del self.users[input['user_id']]

			elif input and input['type'] == 'get_entities':
				self.returnEntities()

			elif input and input['type'] == "stop" and input['input'] == True:
				self.alive.clear()
				print "stopping thread (hopefully)"
				break
			else:
				self.updateEntities(input)

	def updateEntities(self, input):
		for entity in self.entities:
			self.entities[entity].update(input)

	def returnEntities(self):
		entity_list = {}
		for entity in self.entities:
			the_entity = self.entities[entity]
			entity_json = {"user_id": the_entity.user_id, "x": the_entity.x, "y": the_entity.y, "path": the_entity.path, "destination": the_entity.destination}
			entity_list[entity] = entity_json

		print "returning entities"
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

	def processInput(self, input):
		if input and input['input']['entity_id'] and input['input']['entity_id'] == self.id:
			return input
		else:
			return None

	def updatePathing(self, input):
		if input and input['type'] == 'player_move':
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