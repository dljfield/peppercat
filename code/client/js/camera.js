var Camera = Class.extend({

    x: null,
    y: null,

    init: function() {
        this.x = 0;
        this.y = 0;
    },

    setPos: function(x, y) {
        this.x = x;
        this.y = y;
    }

});