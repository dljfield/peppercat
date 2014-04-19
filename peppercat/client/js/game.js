/* Starts the game. */
var USER = {"id": null, "type": null};

window.onload = function() {
	startEngine();
};

function startEngine() {
	if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    decoded_response = JSON.parse(httpRequest.response)
                    USER.id = decoded_response.user;
                    USER.type = decoded_response.type;

                    var engine = new Engine();
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