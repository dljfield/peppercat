/* Starts the game. */

var TILE_WIDTH      = 64;
var TILE_HEIGHT     = 64;
var UPDATE_INTERVAL = 1000 / 30;

var engine = new Engine(document.getElementById('game_canvas'));

var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
socket.on('test_response', function(message) {
	console.log("Received: " + message.data);
});

socket.emit('test_message', {data: 'say'});

window.onload = function() { engine.start() };