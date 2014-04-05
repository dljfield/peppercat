# http://sdiehl.github.io/gevent-tutorial/
# http://stackoverflow.com/questions/5179467/equivalent-of-setinterval-in-python

# JavaScript style setInterval
# because I am a fool and didn't run the whole server in an event loop to start with
import threading, time
def setInterval(interval, times = -1):
    # This will be the actual decorator,
    # with fixed interval and times parameter
    def outer_wrap(function):
        # This will be the function to be
        # called
        def wrap(*args, **kwargs):
            stop = threading.Event()

            # This is another function to be executed
            # in a different thread to simulate setInterval
            def inner_wrap():
                i = 0
                while i != times and not stop.isSet():
                    stop.wait(interval)
                    function(*args, **kwargs)
                    i += 1

            t = threading.Timer(0, inner_wrap)
            t.daemon = True
            t.start()
            return stop
        return wrap
    return outer_wrap

from datetime import datetime
class GameLoop():

	users = {}
	entities = {}

	print_out = []

	def __init__(self, users, entities):
		self.stopper = self.tick() # run the game loop

	@setInterval(1)
	def tick(self, *args):
		self.updateEntities()

	def updateEntities(self):
		for entity in self.entities:
			entity.update()

	def set_print_out(self, message):
		self.print_out.append(message)

	def stop(self):
		print "stopping"
		self.stopper.set()

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
					self.x += self.speed * 8
			elif self.x > self.destination.x:
				if self.x - self.destination.x <= self.speed:
					self.x = self.destination.x;
				else:
					self.x -= self.speed * 8;

			if self.y < self.destination.y:
				if self.destination.y - self.y <= self.speed:
					self.y = self.destination.y
				else:
					self.y += self.speed * 8
			elif self.y > self.destination.y:
				if self.y - self.destination.y <= self.speed:
					self.y = self.destination.y
				else:
					self.y -= self.speed * 8