/* Starts the game. */

var TILE_WIDTH      = 64;
var TILE_HEIGHT     = 64;
var UPDATE_INTERVAL = 1000 / 30;

window.onload = function() {
	document.getElementById('username_form').onsubmit = function() {
		var username = document.getElementById("username").value;

		console.log(username);

		startEngine(username);

		return false;
	}
};

function startEngine(username) {
	var engine = new Engine(username);
	engine.start();
}