var Network = Class.extend({

	server: null,
	gameSocket: null,
	engine: null,

	init: function(engine) {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');

		this.engine = engine;

		this.registerEvents();
	},

	registerEvents: function() {
		this.gameSocket.on('player_move', function(data) {
			this.engine.addInput(data.type, data.path, data.id);
			console.log(data);
		}.bind(this));
	},

	playerMove: function(path, id) {
		if (path && id) {
			this.gameSocket.emit('player_move', {
				'id': id,
				'path': path
			});
		}
	},

});