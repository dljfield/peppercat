var Entity = Class.extend({

	x: null,
	y: null,
	z: null,
	id: null,
	user: null,
	height: null,
	collidable: false,
	sprite: null,
	components: [],

	init: function(id, user, x, y, z, height, collidable, sprite) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.id = id;
		this.user = user;
		this.height = height;
		this.collidable = (collidable) ? collidable : false;
		this.sprite = sprite;
	},

	update: function() {};

});