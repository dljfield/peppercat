/**
 * Helper functions that don't need to be in a class.
 */

function loadSprite(src, id) {
    var sprite = [id, new Image(), false]; // [id#, sprite, loaded?]

    sprite[1].src = src;
    sprite[1].onload = function() { sprite[2] = true };

    return sprite;
}

function spritesLoaded(sprites) {
    for (var i = 0; i < sprites.length; i++) {
        if (sprites[i][2] === false)
            return false;
    }

    return true;
}

function toIsometric(x, y) {
	var isoCoords = {};

    isoCoords.x = x - y;
    isoCoords.y = (x + y) / 2;

    return isoCoords;
}