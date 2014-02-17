var Character = Entity.extend({

	x: null,
	y: null,
	z: null,
	height: null,
	collidable: false,
	sprite: null,

	init: function(x, y, z, height, collidable, sprite) {
		this._super(x, y, z, height, collidable, sprite);
	},

	update: function() {}

});