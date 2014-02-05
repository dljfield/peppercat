/* Primary game handler. Manages state and other such things. */

function Game(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.map = new Map();
    this.camera = new Camera(this);
    this.camera.setXY(-9, 0)
    this.renderer = new Renderer(this, this.camera, this.map);
}

Game.prototype = {
    setMap: function(map) {
        this.map.loadMap(map);
    },

    getCtx: function() {
        return this.ctx;
    },

    getCanvas: function() {
        return this.canvas;
    },

    start: function() {
        this.renderer.drawFrame();
    }
}