/* Loads the scene */

function Scene(scene) {
    this.sprites       = new Sprites(scene.spriteList);
    this.terrain       = scene.terrain;
    this.cells         = scene.cells;
}

Scene.prototype = {
    spritesLoaded: function() {
        return this.sprites.spritesLoaded();
    },

    getTerrainTile: function(x, y) {
        if (this.terrain[y] && this.terrain[y][x])
            return this.sprites.getSprite(this.terrain[y][x]);
    },

    getItemSprite: function(item) {
        if (item.sprite)
            return this.sprites.getSprite(item.sprite);
    },

    getCells: function() {
        return this.cells;
    },

    getTerrain: function() {
        return this.terrain;
    }
}