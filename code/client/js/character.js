var Character = Entity.extend({

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

	update: function() {},

	processInput: function() {
		// get input from the server
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

});