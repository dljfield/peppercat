var TILE_WIDTH      = 64;
var TILE_HEIGHT     = 64;
var UPDATE_INTERVAL = 1000 / 30;

var EVENT_MANAGER = undefined;

var DEBUG = false;

// ########################

var Engine = Class.extend({

    game_id: null,

    canvas: null,
    context: null,

    scene: null,
    camera: null,
    renderer: null,
    network: null,

    previous_time: null,
    lag: 0,

    init: function() {
        this.game_id = document.getElementsByTagName('meta')[1].getAttribute('content');

        this.canvas   = this.createCanvas();
        this.context  = (this.canvas && this.canvas.getContext) ? this.canvas.getContext("2d") : null;

        // event manager
        EVENT_MANAGER = new EventManager();

        //input manager
        this.inputManager = new InputManager(this);

        // game logic
        this.scene    = new Scene(this.game_id);
        this.network  = new Network(this);

        // view classes for the user
        this.ui       = new UserInterface(this);
        this.camera   = new Camera();
        this.renderer = new Renderer();

        this.camera.setPos(450, 100)
    },

    tick: function() {
        var entities = this.scene.getEntities();

        var current_time = Date.now();
        var elapsed_time = current_time - this.previous_time;
        this.previous_time = current_time;
        this.lag += elapsed_time;

        while (this.lag >= UPDATE_INTERVAL) {
            for (var i = 0, len = entities.length; i < len; i++) {
                entities[i].update(this);
            }
            this.lag -= UPDATE_INTERVAL;
        }

        this.scene.setEntities(entities);

        this.network.update();
    },

    render: function() {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.drawFrame(this.canvas, this.context, this.camera, this.scene);
    },

    createCanvas: function() {
        var canvas = document.createElement("canvas");
        canvas.id     = "game_canvas";
        canvas.height = 600;
        canvas.width  = 1000;

        var canvasContainer = document.getElementById("canvas_container");
        canvasContainer.appendChild(canvas);

        return document.getElementById("game_canvas");
    },

    start: function() {
        this.render();

        this.previous_time = Date.now();
        setInterval(this.tick.bind(this), UPDATE_INTERVAL);

        EVENT_MANAGER.addEvent("game_loaded", true);
    }

});