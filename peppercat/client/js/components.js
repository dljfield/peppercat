var PlayerInputComponent = function(entity, engine) {
	while (entity.eventQueue.length != 0) {
		var input = entity.eventQueue.pop();
		if (input.type === 'player_move') {
			return {"input": input.data, "informServer": true};
		} else if ((input.type === 'change_entity' || input.type === 'server_change_entity') && (input.x !== entity.x && input.y !== entity.y) && entity.user === USER.id) {
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

		if (input.type === "server_move" && input.data.entity_id === entity.id) {
			return {"input": input.data.path};
		} else if ((input.type === 'change_entity' || input.type === 'server_change_entity') && input.data.x === entity.x && input.data.y === entity.y && !entity.user) {
			// GM changing to this entity
			entity.user = USER.id;
			entity.updatePathing = PlayerPathingComponent;
			entity.processInput  = PlayerInputComponent;
		}
		return false;
	}
};

var CharacterPathingComponent = function(scene, input, entity) {
	if (input) {
		entity.path = input;
	}
};