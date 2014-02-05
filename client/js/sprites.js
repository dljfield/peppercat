/**
 * Loads and stores the sprites for a scene.
 */

function Sprites(spriteList) {
	this.sprites = {};
	this.loadSpriteList(spriteList);
}

Sprites.prototype = {
	loadSpriteList: function(spriteList) {
		for (id in spriteList) {
			this.sprites[id] = this.loadSprite(spriteList[id])
		}
	},

	loadSprite: function(src) {
		var sprite = {"image": new Image(), "loaded": false};

		sprite["image"].src = src;
		sprite["image"].onload = function() { sprite.loaded = true };

		return sprite;
	},

	getSprite: function(id) {
		return this.sprites[id].image;
	},

	spritesLoaded: function() {
		for (sprite in this.sprites) {
			if (this.sprites[sprite].loaded === false)
				return false;
		}
		return true;
	}
}