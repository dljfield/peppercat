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

		this.gameSocket.on('change_entity', function(data) {
			this.engine.addInput(data);
			console.log(data);
		}.bind(this));
	},

	playerMove: function(path, user) {
		if (path && id) {
			this.gameSocket.emit('player_move', {
				'game_id': this.engine.game_id,
				'user': user,
				'path': path
			});
		}
	},

	changeEntity: function(user, x, y) {
		if (user && x && y) {
			this.gameSocket.emit('change_entity', {
				'game_id': this.engine.game_id,
				'user': user,
				'x': x,
				'y': y
			});
		}
	}

});