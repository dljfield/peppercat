/* Starts the game. */

var TILE_WIDTH      = 64;
var TILE_HEIGHT     = 64;
var UPDATE_INTERVAL = 1000 / 30;

var engine = new Engine(document.getElementById('game_canvas'));

window.onload = function() { engine.start() };