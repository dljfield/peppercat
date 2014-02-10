/* Primary game handler. Manages state and other such things. */

function Game(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.ctx.translate(320, 100); // render nearer the centre of the canvas so that 0,0 isn't in some random place

    this.scene = new Scene(SCENE_1);
    this.camera = new Camera(this);
    this.camera.setXY(5, -1);
    this.renderer = new Renderer(this.canvas, this.camera, this.scene);
}

Game.prototype = {
    setScene: function(scene) {
        this.scene.loadScene(scene);
    },

    tick: function() {
        // update and stuff
        setTimeout(this.tick.bind(this), 1000 / FPS);
    },

    start: function() {
        if (this.scene.spritesLoaded() === false) {
            setTimeout(this.start, 100);
        } else {
            this.renderer.drawFrame();
            this.tick();
        }
    }
};