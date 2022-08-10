var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var Vec2 = /** @class */ (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.add = function (other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    };
    Vec2.prototype.mul = function (scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    };
    Vec2.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    Vec2.randomVec = function () {
        return new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    };
    return Vec2;
}());
function lerp(alpha, a, b) {
    return a + (b - a) * alpha;
}
var PerlinLayer = /** @class */ (function () {
    function PerlinLayer(size) {
        this.size = size;
        this.corners = [];
        for (var x = 0; x < size; x++) {
            this.corners.push([]);
            for (var y = 0; y < size; y++) {
                this.corners[x].push(Vec2.randomVec());
            }
        }
    }
    PerlinLayer.prototype.value = function (canvasX, canvasY) {
        var normVec = new Vec2(canvasX / canvas.width * this.size, canvasY / canvas.height * this.size);
        var indexVec = new Vec2(Math.floor(normVec.x), Math.floor(normVec.y));
        var fracVec = new Vec2(normVec.x % 1, normVec.y % 1);
        var dot0 = fracVec.dot(this.corners[indexVec.x][indexVec.y]);
        var dot1 = fracVec.dot(this.corners[indexVec.x + 1][indexVec.y]);
        var dot2 = fracVec.dot(this.corners[indexVec.x][indexVec.y + 1]);
        var dot3 = fracVec.dot(this.corners[indexVec.x + 1][indexVec.y + 1]);
        var x0 = lerp(fracVec.x, dot0, dot1);
        var x1 = lerp(fracVec.x, dot2, dot3);
        return lerp(fracVec.y, x0, x1);
    };
    return PerlinLayer;
}());
function setup() {
    var id = ctx.createImageData(canvas.width, canvas.height);
    var d = id.data;
    var layer0 = new PerlinLayer(4);
}
setup();
