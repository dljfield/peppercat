var Player = Character.extend({

	x: null,
	y: null,
	z: null,
	height: null,
	collidable: false,
	sprite: null,
	path: null,
	destination: null,
	speed: 0.125,

	init: function(x, y, z, height, collidable, sprite) {
		this._super(x, y, z, height, collidable, sprite);
	},

	update: function(input, scene) {
		var processedInput = null;
		if (input) {
			processedInput = this.processInput(input, scene);
		}

		this.updatePosition(scene, processedInput);
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
			document.getElementById('output').innerHTML = "<p> x: " + tileCoords.x + ", y: " + tileCoords.y;
			return tileCoords;
		}
	},

	findPath: function(scene, position) {
		var graph = scene.sceneGraph();

		var x, y;

		if (this.destination) {
		    x = this.destination.x;
		    y = this.destination.y;
		} else {
		    x = this.x;
		    y = this.y;
		}

		var start = graph.nodes[y][x];
		var end   = graph.nodes[position.y][position.x];

		return astar.search(graph.nodes, start, end);
	}

});