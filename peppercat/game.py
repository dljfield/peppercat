import threading, Queue, time, datetime

UPDATE_INTERVAL = (1.0 / 30)

class GameLoop(threading.Thread):

	def __init__(self, initial_user = None, entities = None, scene = None, queue = None):
		super(GameLoop, self).__init__()
		self.queue = queue

		self.scene = scene
		self.entities = {}

		for entity in entities:
			print "ADDING ENTITIES"
			self.entities[entity.id] = Entity(entity.x, entity.y)

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
			try:
				input = self.queue.get(True, 0.01) # One input per frame. Same limit exists on the client-side really
												   # but it shouldn't affect the responsiveness of things for now
				self.lag -= UPDATE_INTERVAL 	   # given how few inputs there actually are

				if input['type'] == 'add_user':
					print "Adding user: " + input['input']['username']
					self.users[input['input']['id']] = input['input']['username']

				if input['type'] == 'remove_user':
					del self.users[input['user_id']]

				if input['type'] == "stop" and input['input'] == True:
					self.alive.clear()
					print "stopping thread (hopefully)"
					break
				else:
					print "Updating entities"
					self.updateEntities(input)

			except Queue.Empty as e:
				continue

	def updateEntities(self, input):
		for entity in self.entities:
			print "IN ENTITY LOOP"
			entity.update(input)

class Entity():
	x = None
	y = None
	path = []
	destination = {'x': None, 'y': None}
	speed = 0.125

	def __init__(self, x, y):
		self.x  = x
		self.y  = y

	def update(self, input):
		self.updatePathing(input)
		self.updateDestination(input)
		self.updatePosition(input)

	def updatePathing(self, path):
		if path:
			self.path = path

	def updateDestination(self):
		if not self.destination and self.path:
			self.destination = self.path.pop(0)

		if self.destination and self.x == self.destination.x and self.y == self.destination.y:
			self.destination = self.path.pop(0)

	def updatePosition(self):
		if self.destination:
			if self.x < self.destination.x:
				if self.destination.x - self.x <= self.speed:
					self.x = self.destination.x
				else:
					self.x += self.speed
			elif self.x > self.destination.x:
				if self.x - self.destination.x <= self.speed:
					self.x = self.destination.x;
				else:
					self.x -= self.speed;

			if self.y < self.destination.y:
				if self.destination.y - self.y <= self.speed:
					self.y = self.destination.y
				else:
					self.y += self.speed
			elif self.y > self.destination.y:
				if self.y - self.destination.y <= self.speed:
					self.y = self.destination.y
				else:
					self.y -= self.speed