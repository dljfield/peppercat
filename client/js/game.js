/* Primary game handler. Manages state and other such things. */

function Game(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.map = new Map();
    this.camera = new Camera(this);
    // this.camera.setXY(-3, -2);
    this.renderer = new Renderer(this, this.camera, this.map);
}

Game.prototype.setMap = function(map) {
    this.map.loadMap(map);
};

Game.prototype.getCtx = function() {
    return this.ctx;
};

Game.prototype.getCanvas = function() {
    return this.canvas;
};

Game.prototype.start = function() {
    this.renderer.drawFrame();
};