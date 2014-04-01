var PlayerInputComponent = function(input, scene, entity) {
	for (var i = 0, length = input.length; i < length; i++) {
		if (input[i].type === 'move') {
			entity.updateServer();
			return input[i];
		}
	}

	return null;
};

var PlayerPathingComponent = function(scene, input, entity) {
	// if we've been given a new input, get a path for it and set the destination to the first node
	if (scene && input) {
		entity.path = entity.findPath(scene, {"x": input.x, "y": input.y});
	}
};

var CharacterInputComponent = function(input, scene, entity) {
	for (var i = 0, length = input.length; i < length; i++) {
		if (input[i].type === "server" && input[i].id === entity.id) {
			return input[i].path;
		} else if (input[i].type === "change_entity" && input[i].x === entity.x && input[i].y === entity.y) {
			entity.user = USER.id;
			entity.updatePathing = PlayerPathingComponent;
			entity.processInput = PlayerInputComponent;
		}
	}
	return false;
};

var CharacterPathingComponent = function(scene, input, entity) {
	if (input) {
		entity.path = input;
	}
};