var Engine = Class.extend({

    canvas: null,
    context: null,

    scene: null,
    camera: null,
    renderer: null,

    input: null,

    init: function(canvas) {
        this.canvas   = canvas;
        this.context  = (canvas && canvas.getContext) ? canvas.getContext("2d") : null;

        this.canvas.addEventListener('click', this.handleInput.bind(this), false);

        this.scene    = new Scene(SCENE_1);
        this.camera   = new Camera();
        this.renderer = new Renderer();

        this.camera.setPos(435, 100)
    },

    tick: function() {
        var entities = this.scene.getEntities();

        for (var i = 0, len = entities.length; i < len; i++) {
            entities[i].update(this.input, this.scene);
        }

        this.scene.setEntities(entities);
        this.input = null;
    },

    render: function() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.drawFrame(this.canvas, this.context, this.camera, this.scene);
    },

    handleInput: function(event) {
        var canvasPosition = {};

        canvasPosition.x = ((event.x - this.camera.x) - this.canvas.offsetLeft) - (TILE_WIDTH / 2);
        canvasPosition.y = ((event.y - this.camera.y) - this.canvas.offsetTop);

        this.input = canvasPosition;
    },

    start: function() {
        this.render();
        setInterval(this.tick.bind(this), UPDATE_INTERVAL);
    }

});