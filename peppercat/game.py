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


class GameLoop():

	print_out = []

	def __init__(self):
		# self.print_out = ""
		self.stopper = self.tick('tick')

	@setInterval(1)
	def tick(self, *args, **kwargs): ## what even is.. I don't know, it just makes it work :x
	    print self.print_out

	def set_print_out(self, message):
		self.print_out.append(message)

	def stop(self):
		print "stopping"
		self.stopper.set()

