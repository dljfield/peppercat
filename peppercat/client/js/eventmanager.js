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
		for (i = 0, len = this.eventQueue.length; i < len; i++) {
			var currentEvent = this.eventQueue.pop();

			for (j = 0, len = this.listeners.length; j < len; j++) {
				if (this.listeners[j].type = currentEvent.type) {
					this.listeners[j].eventNotification(currentEvent);
				}
			}
		}
	},

});