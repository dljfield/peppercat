/* This is responsible for rendering things to the canvas */

function Renderer(game, camera, scene) {
    this.camera = camera;
    this.scene  = scene;
    this.ctx    = game.getCtx();
}

Renderer.prototype = {
    drawFrame: function() {
        if (this.scene.spritesLoaded() === false)
            setTimeout(this.drawFrame(), 100);

        this.drawTerrain();
        this.drawCells();
    },

    drawTerrain: function() {
        var terrain = this.scene.getTerrain();

        for (var y = 0; y < terrain.length; y++) {
            for (var x = 0; x < terrain[y].length; x++) {
                var isoCoords = this.toIsometric(x + this.camera.x, y + this.camera.y),
                    tile      = this.scene.getTerrainTile(x, y);

                if (tile != undefined)
                    this.render(tile, isoCoords.x * TILE_SIZE, isoCoords.y * TILE_SIZE);
            }
        }
    },

    drawCells: function() {
        var cells = this.scene.getCells();

        for (id in cells) {
            var isoCoords = this.toIsometric(cells[id].x + this.camera.x, cells[id].y + this.camera.y);
            for (item in cells[id].items) {
                var sprite = this.scene.getItemSprite(cells[id].items[item]);
                this.render(sprite, isoCoords.x * TILE_SIZE, isoCoords.y * TILE_SIZE - cells[id].items[item].height);
            }
        }
    },

    render: function(sprite, x, y) {
        // this.ctx.save();
        // this.ctx.translate(320, 100);
        this.ctx.drawImage(sprite, x, y);
        // this.ctx.restore();
    },

    toIsometric: function(x, y) {
        var isoCoords = {};

        isoCoords.x = x - y;
        isoCoords.y = (x + y) / 2;

        return isoCoords;
    }
};