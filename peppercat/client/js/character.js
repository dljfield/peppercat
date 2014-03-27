var Character = Entity.extend({

	x: null,
	y: null,
	z: null,
	id: null,
	user: null,
	height: null,
	collidable: false,
	sprite: null,
	path: null,
	destination: null,
	speed: 0.125,

	init: function(id, user, x, y, z, height, collidable, sprite) {
		this._super(id, user, x, y, z, height, collidable, sprite);
	},

	update: function(input, scene, network) {
		var processedInput = null;
		if (input.length !== 0) {
			processedInput = this.processInput(input, scene);
		}

		this.updatePathing(processedInput);
		this.updateDestination();
		this.updatePosition();
	},

	processInput: function(input) {
		for (var i = 0, length = input.length; i < length; i++) {
			if (input[i].type === "server" && input[i].id === this.id) {
				return input[i].path;
			}
		}
		return false;
	},

	updatePathing: function(input) {
		if (input) {
			this.path = input;
		}
	},

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

});