var PlayerInputComponent = function(entity, engine) {
	while (entity.eventQueue.length != 0) {
		var input = entity.eventQueue.pop();
		if (input[i].type === 'player_move') {
			return {"input": input[i], "informServer": true};
		} else if ((input[i].type === 'change_entity' || input[i].type === 'server_change_entity') && (input[i].x !== entity.x && input[i].y !== entity.y) && entity.user === USER.id) {
			// GM changing to another entity
			entity.user          = null;
			entity.updatePathing = CharacterPathingComponent;
			entity.processInput  = CharacterInputComponent;
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

var CharacterInputComponent = function(entity, engine) {

	while (entity.eventQueue.length != 0) {
		var input = entity.eventQueue.pop();

		for (var i = 0, length = input.length; i < length; i++) {
			if (input[i].type === "server" && input[i].entity_id === entity.id) {
				return {"input": input[i].path};
			} else if ((input[i].type === 'change_entity' || input[i].type === 'server_change_entity') && input[i].x === entity.x && input[i].y === entity.y && !entity.user) {
				// GM changing to this entity
				entity.user = USER.id;
				entity.updatePathing = PlayerPathingComponent;
				entity.processInput  = PlayerInputComponent;
			}
		}
		return false;
	}
};

var CharacterPathingComponent = function(scene, input, entity) {
	if (input) {
		entity.path = input;
	}
};