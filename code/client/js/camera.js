/* Sets the visible area */

function Camera() {
    this.x = 0;
    this.y = 0;
}

Camera.prototype = {
    setXY: function(x, y) {
        this.x = x;
        this.y = y;
    }
};