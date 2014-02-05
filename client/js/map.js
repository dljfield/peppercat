/* Loads the map */

var testmap = [
    [2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,1,1,1,1,1,1,1,1,2],
    [2,2,2,2,2,2,2,2,3,2],
];

function Map(map) {
    if (map != null)
        this.currentMap = this.loadMap(map);
    else
        this.currentMap = this.loadMap();

    this.loadSprites();
}

Map.prototype = {
    loadMap: function(map) {
        return testmap;
    },

    getMap: function() {
        return this.currentMap;
    },

    loadSprites: function() {
        this.sprites = [];

        this.sprites[1] = loadSprite('sprite/tile_floor.png', 1);
        this.sprites[2] = loadSprite('sprite/tile_wall.png', 2);
        this.sprites[3] = loadSprite('sprite/tile_books_cut.png', 3);
    },

    spritesLoaded: function() {
        return spritesLoaded(this.sprites);
    },

    getSprite: function(id) {
        if (id != 0)
            return this.sprites[id][1];
        else
            return 0;
    }
};