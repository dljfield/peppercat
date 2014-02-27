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

	updatePosition: function(scene, position) {

		// if we've been given a new position, get a path for it and set the destination to the first node
		if (scene && position) {
			this.path = this.findPath(scene, position);
			if (!this.destination)
				this.destination = this.path.shift();
		}

		// if we've moved to the current destination we need to get the next node on the list
		if (this.destination && this.x === this.destination.x && this.y === this.destination.y) {
			this.destination = this.path.shift();
		}

		// if we have a destination, move the player towards it based on the speed
		if (this.destination) {
			if (this.x < this.destination.x) {
				if (this.destination.x - this.x <= this.speed) {
					this.x = this.destination.x;
				} else {
					this.x += this.speed;
				}
			} else if (this.x > this.destination.x) {
				if (this.x - this.destination.x <= this.speed) {
					this.x = this.destination.x;
				} else {
					this.x -= this.speed;
				}
			}

			if (this.y < this.destination.y) {
				if (this.destination.y - this.y <= this.speed) {
					this.y = this.destination.y;
				} else {
					this.y += this.speed;
				}
			} else if (this.y > this.destination.y) {
				if (this.y - this.destination.y <= this.speed) {
					this.y = this.destination.y;
				} else {
					this.y -= this.speed;
				}
			}
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