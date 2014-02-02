/* Loads the map */

var testmap = [
    ['2','2','2','2','2','2','2','2','2','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','1','1','1','1','1','1','1','1','2'],
    ['2','2','2','2','2','2','2','2','2','2'],
]


function Map(map) {
    if (map != null)
        this.currentMap = this.loadMap(map);
    else
        this.currentMap = this.loadMap();

    this.loadSprites();
}

Map.prototype.loadMap = function(map) {
    return testmap;
};

Map.prototype.getMap = function() {
    return this.currentMap;
};

Map.prototype.loadSprites = function() {
    this.sprites = [];

    this.sprites[0] = loadSprite('sprite/tile_black.png', 0);
    this.sprites[1] = loadSprite('sprite/tile_grass.png', 1);
    this.sprites[2] = loadSprite('sprite/tile_rockgrass.png', 2);
};

Map.prototype.spritesLoaded = function() {
    for (var i = 0; i < this.sprites.length; i++) {
        if (sprites[i][2] === false)
            return false;
    }

    return true;
};

Map.prototype.getSprite = function(id) {
    return this.sprites[id][1];
}