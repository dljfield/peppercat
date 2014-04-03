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
        var sortedEntities = this.depthSort(scene.getEntities());

        for (var i = 0, len = sortedEntities.length; i < len; i++) {
            var isoCoords = this.toIsometric(sortedEntities[i].x, sortedEntities[i].y),
                sprite    = scene.getSprite(sortedEntities[i].sprite);

            if (sprite != undefined)
                if (sortedEntities[i].user) {
                    this.drawNameplate(context, sortedEntities[i], isoCoords);
                }
                this.draw(context, sprite, isoCoords.x * (TILE_WIDTH / 2), isoCoords.y * (TILE_HEIGHT / 2) - (sortedEntities[i].height - (TILE_HEIGHT / 2)));
        }
    },

    drawNameplate: function(context, entity, coords) {
        // nameplate
        context.fillStyle = 'rgba(0,0,0,0.5)';
        context.fillRect(coords.x * (TILE_WIDTH / 2) - ((TILE_WIDTH / 2) / 2), (coords.y * (TILE_HEIGHT / 2) - (entity.height - (TILE_HEIGHT / 2))) - (TILE_HEIGHT / 2), 100, 25);

        // text in nameplate
        context.fillStyle = 'rgba(255,255,255,1)';
        context.font = "12px sans-serif";
        context.fillText(entity.user, coords.x * (TILE_WIDTH / 2), (coords.y * (TILE_HEIGHT / 2) - (entity.height - (TILE_HEIGHT / 2))) - ((TILE_HEIGHT / 2) / 2));
    },

    draw: function(context, sprite, x, y) {
        context.drawImage(sprite, x, y);
    },

    depthSort: function(entities) {
        var buckets = [];

        for (entity in entities) {
            var depth = this.calculateDepth(entities[entity]);

            if (!buckets[depth])
                buckets[depth] = [];
            buckets[depth].push(entities[entity]);
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
        return (entity.x * TILE_WIDTH / 2) + (entity.y * TILE_HEIGHT / 2) + entity.z;
    },

    toIsometric: function(x, y) {
        var isoCoords = {};

        isoCoords.x = x - y;
        isoCoords.y = (x + y) / 2;

        return isoCoords;
    }

});