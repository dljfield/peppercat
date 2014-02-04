/* This is responsible for rendering things to the canvas */

function Renderer(game, camera, map) {
    this.camera = camera;
    this.map    = map;
    this.ctx    = game.getCtx();
}

Renderer.prototype = {
    drawFrame: function() {
        this.drawMap();
        // draw player
        // draw items
        // etc
    },

    drawMap: function() {
        // make sure the sprite tiles are loaded first
        if (this.map.spritesLoaded === false)
            setTimeout(this.drawMap(), 100);

        for (var y = 0; y < this.camera.tilesY; y++) { // rows
            for (var x = 0; x < this.camera.tilesX; x++) { // columns
                var mapX = x + this.camera.x;
                var mapY = y + this.camera.y;
                var mapLayout = this.map.getMap();

                var sprite = this.map.getSprite((mapLayout[mapY] && mapLayout[mapY][mapX] != undefined) ? mapLayout[mapY][mapX] : 0);

                var isoCoords = toIsometric(x, y)

                this.render(sprite, isoCoords.x * 32, isoCoords.y * 32);
            }
        }
    },

    render: function(sprite, x, y) {
        this.ctx.drawImage(sprite, x, y);
    }
};