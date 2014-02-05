/* Primary game handler. Manages state and other such things. */

function Game(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.scene = new Scene(SCENE_1);
    this.camera = new Camera(this);
    this.camera.setXY(-9, 0)
    this.renderer = new Renderer(this, this.camera, this.scene);
}

Game.prototype = {
    setScene: function(scene) {
        this.scene.loadScene(scene);
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