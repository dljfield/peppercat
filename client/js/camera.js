/* Sets the visible area */

function Camera(game) {
    var canvas  = game.getCanvas();
    this.width  = canvas.width;
    this.height = canvas.height;

    // location of the camera
    this.x = 0;
    this.y = 0;

    // sets the number of tiles that need to be rendered
    this.tilesX = this.width / TILE_SIZE;
    this.tilesY = this.height / TILE_SIZE;
}

Camera.prototype = {
    setXY: function(x, y) {
        this.x = x;
        this.y = y;
    }
};