var PlayerInputComponent = Class.extend({

	init: function() {},

	update: function(input, scene, entity) {
		for (var i = 0, length = input.length; i < length; i++) {
			if (input[i].type === 'move') {
				var cartCoords = (function(x, y){
					var coords = {};
					coords.x = (2 * y + x) / 2;
					coords.y = (2 * y - x) / 2;
					return coords;
				})(input[i].x, input[i].y);

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
			}
		}

		return null;
	},

});

var PlayerPathingComponent = function(scene, position, entity) {
		// if we've been given a new position, get a path for it and set the destination to the first node
		if (scene && position) {
			entity.path = entity.findPath(scene, position);
		}
	};