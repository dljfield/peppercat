/* Starts the game. */

var TILE_SIZE = 32; // half the actual tile size because ~isometric~
var FPS       = 30;

var game = new Game(document.getElementById('canvas'));

window.onload = function() { game.init(); };
