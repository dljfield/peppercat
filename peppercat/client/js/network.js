var Network = Class.extend({

	server: null,
	gameSocket: null,
	fuckYouSocket: null,
	engine: null,

	init: function(engine) {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');

		this.engine = engine;

		this.registerEvents();
	},

	registerEvents: function() {
		this.gameSocket.on('player_move', function(data) {
			this.engine.addInput(data);
			console.log(data);
		}.bind(this));
	},

	playerMove: function(path, entity_id) {
		if (path && entity_id) {
			this.gameSocket.emit('player_move', {
				'game_id': this.engine.game_id,
				'entity_id': entity_id,
				'path': path
			});
		}
	},

	gameLoaded: function() {
		this.gameSocket.emit('game_loaded', {'game_id': this.engine.game_id});
	}

});