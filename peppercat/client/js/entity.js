var Entity = Class.extend({

	x: null,
	y: null,
	z: null,
	id: null,
	height: null,
	collidable: false,
	sprite: null,

	init: function(id, x, y, z, height, collidable, sprite) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.id = id;
		this.height = height;
		this.collidable = (collidable) ? collidable : false;
		this.sprite = sprite;
	},

	update: function() {}

});