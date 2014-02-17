var Player = Character.extend({

	x: null,
	y: null,
	z: null,
	height: null,
	collidable: false,
	sprite: null,

	init: function(x, y, z, height, collidable, sprite) {
		this._super(x, y, z, height, collidable, sprite);
	},

	update: function(input) {
		var processedInput = null;
		if (input) {
			processedInput = this.processInput(input);
		}

		if (processedInput) {
			this.updatePosition(processedInput);
		}
	},

	processInput: function(input) {
		var cartCoords = (function(x, y){
			var coords = {};
			coords.x = (2 * y + x) / 2;
			coords.y = (2 * y - x) / 2;
			return coords;
		})(input.x, input.y);

		var tileCoords = (function(x, y){
			var coords = {};
			coords.x = Math.floor(x / (TILE_WIDTH / 2));
			coords.y = Math.floor(y / (TILE_WIDTH  / 2));
			return coords;
		})(cartCoords.x, cartCoords.y);

		console.log(tileCoords);
		return tileCoords;
	},

	updatePosition: function(position) {
		this.x = position.x;
		this.y = position.y;
	}

});