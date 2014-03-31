var Engine = Class.extend({

    canvas: null,
    context: null,

    scene: null,
    camera: null,
    renderer: null,
    network: null,

    input: [],

    init: function() {
        this.canvas   = this.createCanvas();
        this.context  = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;

        this.canvas.addEventListener('click', this.handleInput.bind(this), false);

        this.scene    = new Scene();
        this.camera   = new Camera();
        this.renderer = new Renderer();
        this.network  = new Network(this);

        this.camera.setPos(435, 100)
    },

    tick: function() {
        var entities = this.scene.getEntities();

        for (var i = 0, len = entities.length; i < len; i++) {
            entities[i].update(this.input, this.scene, this.network);
        }

        this.scene.setEntities(entities);
        this.resetInput();
    },

    render: function() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.drawFrame(this.canvas, this.context, this.camera, this.scene);
    },

    handleInput: function(event) {
        var canvasPosition = {};

        canvasPosition.x = ((event.clientX - this.camera.x) - this.canvas.offsetLeft) - (TILE_WIDTH / 2);
        canvasPosition.y = ((event.clientY - this.camera.y) - this.canvas.offsetTop);

        if (USER.type === "gamemaster" && event.altKey) {
            this.addInput(canvasPosition, "change_entity");
        } else {
            this.addInput(canvasPosition, "move");
        }


    },

    addInput: function(input, type) {
        if (type) {
            input.type = type;
        }

        this.input.push(input);
    },

    resetInput: function() {
        this.input = [];
    },

    createCanvas: function() {
        var canvas = document.createElement("canvas");
        canvas.id     = "game_canvas";
        canvas.height = 600;
        canvas.width  = 800;

        var canvasContainer = document.getElementById("canvas_container");
        canvasContainer.appendChild(canvas);

        return document.getElementById("game_canvas");
    },

    start: function() {
        this.render();
        setInterval(this.tick.bind(this), UPDATE_INTERVAL);
    }

});