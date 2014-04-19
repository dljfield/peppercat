var InputManager = Class.extend({

	engine: null,

	init: function(engine) {
		this.engine = engine;
		this.addClickHandle();
	},

	addClickHandle: function() {
		this.engine.canvas.addEventListener('click', this.processInput.bind(this), false);
	},

	// work out where was clicked
	processInput: function(event) {
		var canvasPosition = {};

		canvasPosition.x = ((event.clientX - this.engine.camera.x) - this.engine.canvas.offsetLeft) - (TILE_WIDTH / 2);
		canvasPosition.y = ((event.clientY - this.engine.camera.y) - this.engine.canvas.offsetTop);

		var cartCoords = (function(x, y){
		    var coords = {};
		    coords.x = (2 * y + x) / 2;
		    coords.y = (2 * y - x) / 2;
		    return coords;
		})(canvasPosition.x, canvasPosition.y);

		var tileCoords = (function(x, y){
		    var coords = {};
		    coords.x = Math.floor(x / (TILE_WIDTH / 2));
		    coords.y = Math.floor(y / (TILE_WIDTH  / 2));
		    return coords;
		})(cartCoords.x, cartCoords.y);

		this.handleInput(tileCoords);
	},

	// check the validity of the click location
	// and figure out what to do if it is valid
	handleInput: function(coords) {
		var tile = this.engine.scene.tileType(tileCoords);

		if (tile.valid === true) {
			if (tile.type === "entity" && USER.type === "game_master" && event.shiftKey) {
				// game master changing active character
			    EVENT_MANAGER.addEvent("change_entity", coords);
			} else if (tileType === "terrain" && !event.shiftKey) {
				// user is moving their character
			    EVENT_MANAGER.addEvent("move", tileCoords);
			}
		}
	},

});