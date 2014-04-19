// state information
// # state changed function
// ## display state
// update UI to match state
// # attack button

// Game Master
// # stop game

// attack button clicked
// # when an entity is clicked, attack event sent

var UserInterface = Class.extend({

	engine: null,
	debugQueue: [],

	init: function(engine) {
		this.engine = engine;
	},

/*	// move to a debug class to store information and just render that
	addToDebugOutput: function() {

	},

	debugOutput: function() {
		document.getElementById('output').innerHTML = "<p> Event type: " + debug_output_type + " | x: " + tileCoords.x + ", y: " + tileCoords.y;
	}
*/
});