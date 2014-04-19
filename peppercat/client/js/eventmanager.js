var EventManager = Class.extend({

	eventQueue: [],
	listeners: [],

	init: function() {},

	registerListen: function(eventType, listener) {
		this.listeners.push({"eventType": eventType, "listener": listener});
	},

	addEvent: function(type, data) {
		this.eventQueue.push({"type": type, "data": data});
		this.notifyListeners();
	},

	notifyListeners: function() {
		for (i = 0, len = eventQueue.length; i < len; i++) {
			var currentEvent = eventQueue.pop();

			for (j = 0, len = listeners.length; j < len; j++) {
				if (listeners[j].type = currentEvent.type) {
					listeners[j].eventNotification(currentEvent);
				}
			}
		}
	},

});