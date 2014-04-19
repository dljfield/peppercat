var EventManager = Class.extend({

	eventQueue = [],
	listeners  = [],

	init: function() {

	},

	registerListen: function(eventType, listener) {
		this.listeners.push({"eventType": eventType, "listener": listener});
	},

	addEvent: function(type, event) {
		this.eventQueue.push({"type": type, "event": event});
	},

	notifyListeners: function() {

	}

})