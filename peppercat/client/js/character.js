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

	eventQueue: [],

	init: function(id, user, name, x, y, z, height, collidable, sprite, input_component, pathing_component, path, destination, engine) {
		this._super(id, user, x, y, z, height, collidable, sprite);

		this.name          = name;
		this.processInput  = input_component;
		this.updatePathing = pathing_component;

		if (path && destination) {
			this.path        = path;
			this.destination = destination;
		}

		// register the events we want to listen for
		EVENT_MANAGER.registerListen("move", this);
		EVENT_MANAGER.registerListen("change_entity", this);
	},

	update: function(engine) {
		var processedInput = {};
		if (this.eventQueue.length !== 0) {
			processedInput = this.processInput(this, engine);
		}

		this.updatePathing(engine.scene, processedInput.input, this);

		if (processedInput.informServer)
			this.updateServer(engine);

		this.updateDestination();
		this.updatePosition();
	},

	eventNotification: function(event) {
		this.eventQueue.push(event);
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
	},

	updateServer: function(engine) {
		EVENT_MANAGER.addEvent("player_move", {"id": this.id, "path": this.path});
	},

});