import threading, Queue, time, datetime
class GameLoop(threading.Thread):

	def __init__(self, initial_user = None, entities = None, queue = None):
		super(GameLoop, self).__init__()
		self.queue = queue
		self.entities = entities

		self.users = []
		self.users.append(initial_user)

		self.alive = threading.Event()
		self.alive.set()

	def run(self):
		self.previous_time = time.time()
		self.lag = 0

		while self.alive.isSet():
			try:
				self.update()
			except Queue.Empty as e:
				continue

	def update():
		current_time = time.time()
		elapsed_time = current_time - self.previous_time
		self.previous_time = current_time
		self.lag += elapsed_time

		while self.lag >= (1.0 / 30):
			self.lag -= (1.0 / 30)
			input = self.queue.get(True, 0.01)
			if input['type'] == "stop" and input['input'] == True:
				self.alive.clear()
				print "stopping thread (hopefully)"
				break
			else:
				self.updateEntities(input)

	def updateEntities(self, input):
		for entity in self.entities:
			entity.update()

class Entity():
	x = None
	y = None
	id = None
	path = []
	destination = {'x': None, 'y': None}
	speed = 0.125

	def __init__(self, x, y, id):
		self.x  = x
		self.y  = y
		self.id = id

	def update(self):
		self.updatePathing()
		self.updateDestination()
		self.updatePosition()

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