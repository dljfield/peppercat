/* This is responsible for rendering things to the canvas */

function Renderer(canvas, camera, scene) {
    this.camera = camera;
    this.scene  = scene;
    this.canvas = canvas;
    this.ctx    = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
}

Renderer.prototype = {
    drawFrame: function() {
        this.clearFrame();

        this.drawTerrain();
        this.drawCells();

        requestAnimationFrame(this.drawFrame.bind(this));
    },

    clearFrame: function() {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
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

    /**
     * Nested Monstrosity
     */
    drawCells: function() {
        var cells = this.scene.getCells();

        for (var y = 0, ly = cells.length; y < ly; y++) {
            for (var x = 0, lx = cells[y].length; x < lx; x++) {
                if (cells[y][x] !== undefined) {
                   var isoCoords = this.toIsometric(x + this.camera.x, y + this.camera.y);
                   for (item in cells[y][x].items) {
                       var sprite = this.scene.getItemSprite(cells[y][x].items[item]);
                       this.render(sprite, isoCoords.x * TILE_SIZE, isoCoords.y * TILE_SIZE - (cells[y][x].items[item].height - TILE_SIZE));
                   }

                   for (character in cells[y][x].characters) {
                       var sprite = this.scene.getItemSprite(cells[y][x].characters[character]);
                       this.render(sprite, isoCoords.x * TILE_SIZE, isoCoords.y * TILE_SIZE - (cells[y][x].characters[character].height - TILE_SIZE));
                   }
                }
            }
        }
    },

    render: function(sprite, x, y) {
        this.ctx.drawImage(sprite, x, y);
    },

    toIsometric: function(x, y) {
        var isoCoords = {};

        isoCoords.x = x - y;
        isoCoords.y = (x + y) / 2;

        return isoCoords;
    },

    toCartesian: function(x, y) {
        var cartCoords = {};

        cartCoords.x = (2 * y + x) / 2;
        cartCoords.y = (2 * y - x) / 2;

        return cartCoords;
    }
};