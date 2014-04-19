var Network = Class.extend({

	server: null,
	gameSocket: null,
	engine: null,

	eventQueue: null,

	init: function(engine) {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');

		this.engine = engine;

		this.registerEvents();

		engine.eventManager.registerListen("game_loaded", this);
		engine.eventManager.registerListen("player_move", this);
	},

	update: function() {
		// check event queue and tell the server about stuff
		for (i = 0, len = eventQueue.length; i < len; i++) {
			if (eventQueue[i].type === "game_loaded" && eventQueue[i].data === true) {
				this.gameLoaded();
			} else if (eventQueue[i].type === "player_move") {
				this.playerMove(eventQueue[i].data);
			}
		}
	},

	registerEvents: function() {
		this.gameSocket.on('player_move', function(data) {
			this.engine.addInput(data);
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