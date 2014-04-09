var Scene = Class.extend({

    size: {},
    sprites: null,
    terrain: null,
    entities: null,

    init: function(scene) {
        if (scene)
            this.getSceneJSON(scene);
        else
            this.getSceneJSON('');
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

    setEntities: function(entities) {
        this.entities = entities;
    },

    setSize: function() {
        this.size.y = this.terrain.length
        this.size.x = this.terrain[0].length
    },

    // THIS NETWORK STUFF SHOULD BE MOVED TO NETWORK.JS
    getSceneJSON: function(game) {
        if (window.XMLHttpRequest) {
            httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        if (httpRequest.response != "SWAG") {
                            this.loadScene(JSON.parse(httpRequest.response));
                        } else {
                            alert(httpRequest.response);
                        }

                    } else {
                        console.log("SCENE ERROR: ")
                        console.log(httpRequest.response)
                        alert("There was an error getting the scene.");
                    }
                }
            }.bind(this);

            httpRequest.open('GET', 'http://' + document.domain + ':' + location.port + '/scene/' + game, false);
            httpRequest.send();
        } else {
            alert("You need to update your browser.");
        }
    },

    loadScene: function(scene) {
        this.loadTerrain(JSON.parse(scene.terrain));
        this.loadEntities(scene.entities);
        this.loadSprites(scene.sprites);
        this.setSize();
    },

    loadTerrain: function(terrain) {
        this.terrain = terrain;
    },

    loadEntities: function(scene_entities) {
        var entities = [];
        for (entity in scene_entities) {
            if (scene_entities[entity].type === "character" && scene_entities[entity].user === USER.id) {
                entities[entity] = new Character(scene_entities[entity].id, scene_entities[entity].user, scene_entities[entity].name, scene_entities[entity].x, scene_entities[entity].y, scene_entities[entity].z, scene_entities[entity].height, scene_entities[entity].collidable, scene_entities[entity].sprite, PlayerInputComponent, PlayerPathingComponent, scene_entities[entity].path, scene_entities[entity].destination);
            } else if (scene_entities[entity].type === "character") {
                entities[entity] = new Character(scene_entities[entity].id, scene_entities[entity].user, scene_entities[entity].name, scene_entities[entity].x, scene_entities[entity].y, scene_entities[entity].z, scene_entities[entity].height, scene_entities[entity].collidable, scene_entities[entity].sprite, CharacterInputComponent, CharacterPathingComponent, scene_entities[entity].path, scene_entities[entity].destination);
            } else {
                entities[entity] = new Entity(scene_entities[entity].id, scene_entities[entity].user, scene_entities[entity].x, scene_entities[entity].y, scene_entities[entity].z, scene_entities[entity].height, scene_entities[entity].collidable, scene_entities[entity].sprite);
            }
        }

        this.entities = entities;
    },

    loadSprites: function(spriteList) {
        var sprites = {};
        for (id in spriteList) {
            sprites[id] = new Sprite(spriteList[id]);
        }

        this.sprites = sprites;
    },

    tileType: function(coords) {

        if ((coords.x >= this.size.x || coords.y >= this.size.y) || (coords.x < 0 || coords.y < 0))
            return "oob";

        for (var i = 0, len = this.entities.length; i < len; i++) {
            if (this.entities[i].x === coords.x && this.entities[i].y === coords.y && this.entities[i].collidable === true) {
                return "entity";
            }
        }

        return "terrain";
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