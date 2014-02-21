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

	update: function(input, scene) {
		var processedInput = null;
		if (input) {
			processedInput = this.processInput(input, scene);
		}

		if (processedInput) {
			this.updatePosition(scene, processedInput);
		}
	},

	processInput: function(input, scene) {
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

		if (scene.validCoordinates(tileCoords)) {
			return tileCoords;
		}
	},

	updatePosition: function(scene, position) {
		var path = this.findPath(scene, position);

		// this.x = position.x;
		// this.y = position.y;
	},

	findPath: function(scene, position) {
		var graph = scene.sceneGraph();
		var start = graph.nodes[this.y][this.x];
		var end   = graph.nodes[position.y][position.x];

		return astar.search(graph.nodes, start, end);
	}

});