var Network = Class.extend({

	server: null,
	gameSocket: null,
	engine: null,

	eventQueue: [],

	init: function(engine) {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');

		this.engine = engine;

		this.registerEvents();

		EVENT_MANAGER.registerListen("game_loaded", this);
		EVENT_MANAGER.registerListen("inform_server_player_move", this);
	},

	update: function() {
		// check event queue and tell the server about stuff
		while (this.eventQueue.length != 0) {
			var current_event = this.eventQueue.pop();

			if (current_event.type === "game_loaded" && current_event.data === true) {
				this.gameLoaded();
			} else if (current_event.type === "inform_server_player_move") {
				this.playerMove(current_event.data);
			}
		}
	},

	eventNotification: function(event) {
		this.eventQueue.push(event);
	},

	registerEvents: function() {
		this.gameSocket.on('server_move', function(data) {
			EVENT_MANAGER.addEvent('server_move', data);
			console.log(data);
		}.bind(this));
	},

	playerMove: function(data) {
		if (data.id && data.path) {
			this.gameSocket.emit('player_move', {
				'game_id': this.engine.game_id,
				'entity_id': data.id,
				'path': data.path
			});
		}
	},

	// this notifies the server that we're starting the game and it adds us to
	// a socket room so that we get the game's network activity
	gameLoaded: function() {
		this.gameSocket.emit('game_loaded', {'game_id': this.engine.game_id});
	}

});