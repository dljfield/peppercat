/* Starts the game. */

var TILE_WIDTH      = 64;
var TILE_HEIGHT     = 64;
var UPDATE_INTERVAL = 1000 / 30;

window.onload = function() {
	startEngine("player_1");
};

function startEngine(username) {
	if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var engine = new Engine(httpRequest.response);
                    engine.start();
                } else {
                    alert("There was an error.");
                }
            }
        };
        httpRequest.open('GET', 'http://' + document.domain + ':' + location.port + '/user', false);
        httpRequest.send();
    } else {
        alert("You need to update your browser.");
    }
}