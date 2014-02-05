/* Loads the scene */

function Scene(scene) {
    this.sprites = new Sprites(scene.spriteList);
    this.terrain = scene.terrain;
    this.items   = scene.items;
}

Scene.prototype = {
    getTerrain: function() {
        return this.terrain;
    },

    spritesLoaded: function() {
        return sprites.spritesLoaded();
    },

    getSprite: function(id) {
        if (id != "empty")
            return this.sprites.getSprite(id);
        else
            return 0;
    }
};