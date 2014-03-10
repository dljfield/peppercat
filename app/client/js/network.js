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
			engine.addInput(data.type, data.position, data.id)
		}.bind(this));
	},

	playerMove: function(input, id) {
		if (input) {
			this.gameSocket.emit('player_move', {
				'id': id,
				'position': input
			});
			this.gameSocket.emit('test_move', { "data": "buttes" });
		}
	},

});