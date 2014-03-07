var Network = Class.extend({

	server: null,
	gameSocket: null,

	init: function() {
		this.server     = 'http://' + document.domain + ':' + location.port;
		this.gameSocket = io.connect(this.server + '/game');

		this.registerEvents();
		this.testEmit();
	},

	registerEvents: function() {
		this.gameSocket.on('player_move', function(data) {
			console.log(data);
		});
	},

	testEmit: function() {
		this.gameSocket.emit('player_move', {
			'id': '12345',
			'path': ['1', '2']
		});
	}

});