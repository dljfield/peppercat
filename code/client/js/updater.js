/**
 * Handles updates to the internal game state
 */

function Updater(camera, scene) {
	this.camera = camera;
	this.scene  = scene;
	this.input  = {x: 0, y: 0, input: false};
	this.updatePlayer = false;
}

Updater.prototype = {
	update: function() {
		this.processInput();
		this.processPlayer();
	},

	setInput: function(x, y) {
		this.input.x = x;
		this.input.y = y;
		this.input.input = true;
	},

	processInput: function() {
		if (this.input.input === true) {
			this.input.input = false;
			this.updatePlayer = true;
			document.getElementById("tileCoords").innerHTML = "<p> x: " + this.input.x + ", y: " + this.input.y + "</p>";
		}
	},

	processPlayer: function() {
		if (this.updatePlayer) {
			this.updatePlayer = false;
			this.scene.setCell(this.input.x, this.input.y, { "items": {}, "characters": {"player_1": { "sprite": "p_001", "height": 64 }} } );
		}
	}
};