var InputManager = Class.extend({

	engine: null,

	init: function(engine) {
		this.engine = engine;
	},

	registerEvents: function() {
		this.engine.canvas.addEventListener('click', this.processInput.bind(this), false);
	},

	// Work out where was clicked and if it is a valid input location.
	// If it is valid, pass it off to handleInput to decide what to do with it.
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

		var tile = this.engine.scene.tileType(tileCoords);

		this.handleInput(tile, tileCoords);
	},

	handleInput: function(tile, coords) {
		// var debug_output_type = "Ignored";
		if (tile.valid === true) {
			if (tile.type === "entity" && USER.type === "game_master" && event.shiftKey) {
			    this.engine.eventManager.addEvent("change_entity", coords);
			    // debug_output_type = "Change Entity";
			} else if (tileType === "terrain" && !event.shiftKey) {
			    this.engine.eventManager.addEvent("move", tileCoords);
			    // debug_output_type = "Move"
			}
		}

		// document.getElementById('output').innerHTML = "<p> Event type: " + debug_output_type + " | x: " + tileCoords.x + ", y: " + tileCoords.y;
	},

})