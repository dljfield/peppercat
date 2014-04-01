var Character = Entity.extend({

	x: null,
	y: null,
	z: null,
	id: null,
	name: null,
	user: null,
	height: null,
	collidable: false,
	sprite: null,
	path: null,
	destination: null,
	speed: 0.125,

	init: function(id, user, name, x, y, z, height, collidable, sprite, input_component, pathing_component) {
		this._super(id, user, x, y, z, height, collidable, sprite);

		this.name          = name;
		this.processInput  = input_component;
		this.updatePathing = pathing_component;
	},

	update: function(input, scene, network) {
		var processedInput = {};
		if (input.length !== 0) {
			processedInput = this.processInput(input, scene, this);
		}

		this.updatePathing(scene, processedInput.input, this);

		if (processedInput.informServer)
			this.updateServer(network);

		this.updateDestination();
		this.updatePosition();
	},

	processInput: null,

	updatePathing: null,

	updateDestination: function() {
		if (!this.destination && this.path) {
			this.destination = this.path.shift();
		}

		// if we've moved to the current destination we need to get the next node on the list
		if (this.destination && this.x === this.destination.x && this.y === this.destination.y) {
			this.destination = this.path.shift();
		}
	},

	updatePosition: function() {
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

	updateServer: function(network, informServer) {
		network.playerMove(this.path, this.id);
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