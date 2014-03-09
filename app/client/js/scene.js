var Scene = Class.extend({

    size: null,
    sprites: null,
    terrain: null,
    entities: null,

    init: function(scene) {
        if (scene)
            this.getSceneJSON(scene);
        else
            this.getSceneJSON('1');
    },

    getTerrain: function() {
        return this.terrain;
    },

    getEntities: function() {
        return this.entities;
    },

    getSprite: function(id) {
        return this.sprites[id].getImage();
    },

    getSize: function() {
        return this.size;
    },

    setEntities: function(entities) {
        this.entities = entities;
    },

    setSize: function(size) {
        this.size = size;
    },

    getSceneJSON: function(scene) {
        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        var parsedResponse = JSON.parse(httpRequest.response);
                        this.loadScene(parsedResponse);
                    } else {
                        alert("There was an error getting the scene.");
                    }
                }
            }.bind(this);
            httpRequest.open('GET', 'http://localhost:5000/scene/' + scene, false);
            httpRequest.send();
        } else {
            alert("You need to update your browser.");
        }
    },

    loadScene: function(scene) {
        this.size = scene.size;
        this.loadTerrain(scene);
        this.loadEntities(scene);
        this.loadSprites(scene);
    },

    loadTerrain: function(scene) {
        this.terrain = scene.terrain;
    },

    loadEntities: function(scene) {
        var entities = [];
        for (entity in scene.entities) {
            if (scene.entities[entity].type === "player") {
                entities[entity] = new Player(scene.entities[entity].x, scene.entities[entity].y, scene.entities[entity].z, scene.entities[entity].height, scene.entities[entity].collidable, scene.entities[entity].sprite);
            } else if (scene.entities[entity].type === "character") {
                entities[entity] = new Character(scene.entities[entity].x, scene.entities[entity].y, scene.entities[entity].z, scene.entities[entity].height, scene.entities[entity].collidable, scene.entities[entity].sprite);
            } else {
                entities[entity] = new Entity(scene.entities[entity].x, scene.entities[entity].y, scene.entities[entity].z, scene.entities[entity].height, scene.entities[entity].collidable, scene.entities[entity].sprite);
            }
        }

        this.entities = entities;
    },

    loadSprites: function(scene) {
        var spriteList = scene.spriteList;
        var sprites = [];

        for (id in spriteList) {
            sprites[id] = new Sprite(spriteList[id]);
        }

        this.sprites = sprites;
    },

    validCoordinates: function(coords) {

        if ((coords.x >= this.size.x || coords.y >= this.size.y) || (coords.x < 0 || coords.y < 0))
            return false;

        for (var i = 0, len = this.entities.length; i < len; i++) {
            if (this.entities[i].x === coords.x && this.entities[i].y === coords.y && this.entities[i].collidable === true) {
                return false;
            }
        }

        return true;
    },

    sceneGraph: function() {
        var graphArray = new Array(this.size.y);
        for (i = 0, ilen = graphArray.length; i < ilen; i++) {
            graphArray[i] = new Array(this.size.x);
            for (j = 0, jlen = graphArray[i].length; j < jlen; j++) {
                graphArray[i][j] = 1;
            }
        }

        for (entity in this.entities) {

            var x, y;

            if (this.entities[entity].destination) {
                x = this.entities[entity].destination.x;
                y = this.entities[entity].destination.y;
            } else {
                x = this.entities[entity].x;
                y = this.entities[entity].y;
            }

            graphArray[y][x] = 0;
        }

        return new Graph(graphArray);
    }

});