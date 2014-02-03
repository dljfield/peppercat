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