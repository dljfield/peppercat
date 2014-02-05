/* This is responsible for rendering things to the canvas */

function Renderer(game, camera, scene) {
    this.camera = camera;
    this.scene  = scene;
    this.ctx    = game.getCtx();
}

Renderer.prototype = {
    drawFrame: function() {
        this.drawTerrain();
        // draw player
        // draw items
        // etc
    },

    drawTerrain: function() {
        // make sure the sprite tiles are loaded first
        if (this.scene.spritesLoaded === false)
            setTimeout(this.drawTerrain(), 100);

        for (var y = 0; y < this.camera.tilesY; y++) { // rows
            for (var x = 0; x < this.camera.tilesX; x++) { // columns
                var sceneX = x + this.camera.x;
                var sceneY = y + this.camera.y;
                var terrainLayout = this.scene.getTerrain();

                var sprite = this.scene.getSprite((terrainLayout[sceneY] && terrainLayout[sceneY][sceneX] != undefined) ? terrainLayout[sceneY][sceneX] : "empty");

                var isoCoords = this.toIsometric(x, y);

                if (sprite != 0)
                    this.render(sprite, isoCoords.x * TILE_SIZE, isoCoords.y * TILE_SIZE);
            }
        }
    },

    drawItems: function() {
        // draw the items on top of the the terrain
    },

    render: function(sprite, x, y) {
        this.ctx.drawImage(sprite, x, y);
    },

    toIsometric: function(x, y) {
        var isoCoords = {};

        isoCoords.x = x - y;
        isoCoords.y = (x + y) / 2;

        return isoCoords;
    }

};