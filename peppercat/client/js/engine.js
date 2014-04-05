var Engine = Class.extend({

    canvas: null,
    context: null,

    scene: null,
    camera: null,
    renderer: null,
    network: null,

    input: [],

    previous_time: Date.now(),
    lag: 0,

    init: function() {
        this.canvas   = this.createCanvas();
        this.context  = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;

        this.canvas.addEventListener('click', this.handleInput.bind(this), false);

        this.scene    = new Scene();
        this.camera   = new Camera();
        this.renderer = new Renderer();
        this.network  = new Network(this);

        this.camera.setPos(432, 100)
    },

    tick: function() {
        var entities = this.scene.getEntities();

        var current_time = Date.now();
        var elapsed_time = current_time - this.previous_time;
        this.previous_time = current_time;
        this.lag += elapsed_time;

        while (this.lag >= UPDATE_INTERVAL) {
            for (var i = 0, len = entities.length; i < len; i++) {
                entities[i].update(this.input, this.scene, this.network);
            }
            this.lag -= UPDATE_INTERVAL;
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

        var cartCoords = (function(x, y){
            var coords = {};
            coords.x = (2 * y + x) / 2;
            coords.y = (2 * y - x) / 2;
            return coords;
        })(canvasPosition.x, canvasPosition.y);

        var tileCoords = (function(x, y){
            var coords = {};
            coords.x = Math.floor(x / (TILE_WIDTH / 2));
            coords.y = Math.floor(y / (TILE_WIDTH  / 2));
            return coords;
        })(cartCoords.x, cartCoords.y);

        var tileType = this.scene.tileType(tileCoords);

        var debug_output_type = "Ignored";
        if (tileType === "entity" && USER.type === "game_master" && event.shiftKey) {
            this.addInput(tileCoords, "change_entity");
            debug_output_type = "Change Entity";
        } else if (tileType === "terrain" && !event.shiftKey) {
            this.addInput(tileCoords, "move");
            debug_output_type = "Move"
        }

        document.getElementById('output').innerHTML = "<p> Event type: " + debug_output_type + " | x: " + tileCoords.x + ", y: " + tileCoords.y;

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