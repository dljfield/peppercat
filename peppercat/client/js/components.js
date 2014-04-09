var PlayerInputComponent = function(input, scene, entity, network) {
	for (var i = 0, length = input.length; i < length; i++) {
		if (input[i].type === 'move') {
			return {"input": input[i], "informServer": true};
		} else if ((input[i].type === "change_entity" || input[i].type === "server_change_entity") && (input[i].x !== entity.x && input[i].y !== entity.y) && entity.user === USER.id) {
			// GM changing to another entity
			entity.user          = null;
			entity.updatePathing = CharacterPathingComponent;
			entity.processInput  = CharacterInputComponent;

			network.changeEntity(entity.user, entity.x, entity.y);
		}
	}
	return false;
};

var PlayerPathingComponent = function(scene, input, entity) {
	// if we've been given a new input, get a path for it and set the destination to the first node
	if (scene && input) {
		entity.path = entity.findPath(scene, {"x": input.x, "y": input.y});
	}
};

var CharacterInputComponent = function(input, scene, entity, network) {
	for (var i = 0, length = input.length; i < length; i++) {
		if (input[i].type === "server" && input[i].user === entity.user) {
			return {"input": input[i].path};
		} else if ((input[i].type === "change_entity" || input[i].type === "server_change_entity") && input[i].x === entity.x && input[i].y === entity.y && !entity.user) {
			// GM changing to this entity
			if (input[i].user) {
				entity.user = input[i].user
			} else {
				entity.user = USER.id;
				entity.updatePathing = PlayerPathingComponent;
				entity.processInput  = PlayerInputComponent;
			}

			network.changeEntity(entity.user, entity.x, entity.y);
		}
	}
	return false;
};

var CharacterPathingComponent = function(scene, input, entity) {
	if (input) {
		entity.path = input;
	}
};