var Network = Class.extend({

	server: null,
	gameSocket: null,
	fuckYouSocket: null,
	engine: null,

	init: function(engine) {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');
		this.fuckYouSocket = io.connect(this.server)

		this.engine = engine;

		this.registerEvents();
	},

	registerEvents: function() {
		this.gameSocket.on('player_move', function(data) {
			this.engine.addInput(data);
			console.log(data);
		}.bind(this));

		this.fuckYouSocket.on('entity_update', function(data) {
			console.log(data);
		});
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

});