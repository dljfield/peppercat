var Renderer = Class.extend({

    init: function() {},

    drawFrame: function(canvas, context, camera, scene) {
        this.clearFrame(canvas, context);

        context.save();
        context.translate(camera.x, camera.y);
        this.drawTerrain(context, scene);
        this.drawEntities(context, scene);
        context.restore();
    },

    clearFrame: function(canvas, context) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    },

    drawTerrain: function(context, scene) {
        var terrain = scene.getTerrain();
        for (var y = 0; y < terrain.length; y++) {
            for (var x = 0; x < terrain[y].length; x++) {

                var isoCoords = this.toIsometric(x, y),
                    tile      = (terrain[y] && terrain[y][x]) ? scene.getSprite(terrain[y][x]) : undefined;

                if (tile != undefined)
                    this.draw(context, tile, isoCoords.x * (TILE_WIDTH / 2), isoCoords.y * (TILE_HEIGHT / 2));
            }
        }
    },

    drawEntities: function(context, scene) {
        // create array to render from
        entitiesDrawArray = new Array(scene.getSize().y);
        for (var i = 0, len = entitiesDrawArray.length; i < len; i++) {
            entitiesDrawArray[i] = new Array(scene.getSize().x);
        }

        // place the entities in their correct positions in the array
        var entities = scene.getEntities();
        for (entity in entities) {
            entitiesDrawArray[entities[entity].y][entities[entity].x] = {"sprite": entities[entity].sprite, "height": entities[entity].height};
        }

        for (var y = 0; y < entitiesDrawArray.length; y++) {
            for (var x = 0; x < entitiesDrawArray[y].length; x++) {
                var isoCoords = this.toIsometric(x, y),
                    sprite      = (entitiesDrawArray[y] && entitiesDrawArray[y][x]) ? scene.getSprite(entitiesDrawArray[y][x].sprite) : undefined;

                if (sprite != undefined)
                    this.draw(context, sprite, isoCoords.x * (TILE_WIDTH / 2), isoCoords.y * (TILE_HEIGHT / 2) - (entitiesDrawArray[y][x].height - (TILE_HEIGHT / 2)));
            }
        }
    },

    draw: function(context, sprite, x, y) {
        context.drawImage(sprite, x, y);
    },

    ////////////////////////////
    // FUCKIN DEPTH SORTIN M8 //
    ////////////////////////////

    depthSort: function(entities) {
        var buckets = [];

        for (entity in entities) {
            var depth = this.calculateDepth(entities[entity]);
            buckets[depth] = entities[entity];
        }

        var result = [];

        for (bucket in buckets) {
            for (entity in buckets[bucket]) {
                result.push(buckets[bucket][entity]);
            }
        }

        return result;
    },

    calculateDepth: function(entity) {
         return entity.x + entity.y + entity.z;
    },

    //////////////////////
    // END DEPTH SORTIN //
    //////////////////////

    toIsometric: function(x, y) {
        var isoCoords = {};

        isoCoords.x = x - y;
        isoCoords.y = (x + y) / 2;

        return isoCoords;
    }

});