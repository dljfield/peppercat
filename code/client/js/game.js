/* Primary game handler. Manages state and other such things. */

function Game(canvas) {
    this.canvas = canvas;
    this.ctx    = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;
    // this.ctx.translate(320, 100); // render nearer the centre of the canvas so that 0,0 isn't in some random place

    this.scene    = new Scene(SCENE_1);
    this.camera   = new Camera();
    // this.camera.setXY(5, -1);
    this.updater  = new Updater(this.camera, this.scene);
    this.renderer = new Renderer(this.canvas, this.camera, this.scene);
}

Game.prototype = {
    setScene: function(scene) {
        this.scene = new Scene(scene);
    },

    tick: function() {
        this.updater.update();
        setTimeout(this.tick.bind(this), 1000 / FPS);
    },

    clickPosition: function(event) {
        var canvasPos = {};

        canvasPos.x = (event.x - this.canvas.offsetLeft);
        canvasPos.y = (event.y - this.canvas.offsetTop);

        var cartCoords = this.renderer.toCartesian(canvasPos.x, canvasPos.y);

        var tileCoords = this.scene.getTileCoordinates(cartCoords);
        this.updater.setInput(tileCoords.x, tileCoords.y);
    },

    init: function() {
        if (this.scene.spritesLoaded() === false) {
            setTimeout(this.init, 100);
        } else {
            this.canvas.addEventListener('click', this.clickPosition.bind(this), false);
            this.renderer.drawFrame();
            this.tick();
        }
    }
};