var Scene = Class.extend({

    size: null,
    sprites: null,
    terrain: null,
    entities: null,

    init: function(scene) {
        this.terrain  = this.loadTerrain(scene);
        this.entities = this.loadEntities(scene);
        this.sprites  = this.loadSprites(scene.spriteList);

        this.setSize(scene.size);
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

    loadTerrain: function(scene) {
        return scene.terrain;
    },

    loadEntities: function(scene) {
        var entities = []
        for (entity in scene.entities) {
            if (scene.entities[entity].type === "player") {
                entities[entity] = new Player(scene.entities[entity].x, scene.entities[entity].y, scene.entities[entity].z, scene.entities[entity].height, scene.entities[entity].collidable, scene.entities[entity].sprite);
            } else {
                entities[entity] = new Entity(scene.entities[entity].x, scene.entities[entity].y, scene.entities[entity].z, scene.entities[entity].height, scene.entities[entity].collidable, scene.entities[entity].sprite);
            }
        }

        return entities;
    },

    loadSprites: function(spriteList) {
        var sprites = [];

        for (id in spriteList) {
            sprites[id] = new Sprite(spriteList[id]);
        }

        return sprites;
    }

});