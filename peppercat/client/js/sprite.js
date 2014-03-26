var Sprite = Class.extend({

	image: null,
	loaded: false,

	init: function(src) {
		this.image = new Image();
		this.image.src = document.domain + ':' + location.port + '/client/sprite/' + src;
		this.image.onload = function(){this.loaded = true};
	},

	getImage: function() {
		return this.image;
	}

});