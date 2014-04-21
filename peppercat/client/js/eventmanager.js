var EventManager = Class.extend({

	eventQueue: [],
	listeners: [],

	init: function() {},

	registerListen: function(eventType, listener) {
		this.listeners.push({"eventType": eventType, "listener": listener});
	},

	removeListener: function(eventType, listener) {

	},

	addEvent: function(type, data) {
		this.eventQueue.push({"type": type, "data": data});
		this.notifyListeners();
	},

	notifyListeners: function() {
		while (this.eventQueue.length != 0) {
			var currentEvent = this.eventQueue.pop();

			for (j = 0, len = this.listeners.length; j < len; j++) {
				if (this.listeners[j].eventType == currentEvent.type) {
					this.listeners[j].listener.eventNotification(currentEvent);
				}
			}
		}
	},

});