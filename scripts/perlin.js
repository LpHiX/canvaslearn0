"use strict";
var perlin;
(function (perlin) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const debugText = document.getElementById("debugText");
    class Vec2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        add(other) {
            return new Vec2(this.x + other.x, this.y + other.y);
        }
        mul(scalar) {
            return new Vec2(this.x * scalar, this.y * scalar);
        }
        dot(other) {
            return this.x * other.x + this.y * other.y;
        }
        static randomVec() {
            return new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
        }
    }
    function lerp(w, a, b) {
        return a + (b - a) * (w * w * w * ((6 * w - 15) * w + 10));
    }
    class PerlinLayer {
        constructor(size, magnitude) {
            this.size = size;
            this.magnitude = magnitude;
            this.corners = [];
            for (var x = 0; x <= size; x++) {
                this.corners.push([]);
                for (var y = 0; y <= size; y++) {
                    this.corners[x].push(Vec2.randomVec());
                }
            }
        }
        value(canvasX, canvasY) {
            var normVec = new Vec2(canvasX / canvas.width * this.size, canvasY / canvas.height * this.size);
            var indexVec = new Vec2(Math.floor(normVec.x), Math.floor(normVec.y));
            var fracVec = new Vec2(normVec.x % 1, normVec.y % 1);
            var dot0 = new Vec2(fracVec.x, fracVec.y).dot(this.corners[indexVec.x][indexVec.y]);
            var dot1 = new Vec2(fracVec.x - 1, fracVec.y).dot(this.corners[indexVec.x + 1][indexVec.y]);
            var dot2 = new Vec2(fracVec.x, fracVec.y - 1).dot(this.corners[indexVec.x][indexVec.y + 1]);
            var dot3 = new Vec2(fracVec.x - 1, fracVec.y - 1).dot(this.corners[indexVec.x + 1][indexVec.y + 1]);
            var x0 = lerp(fracVec.x, dot0, dot1);
            var x1 = lerp(fracVec.x, dot2, dot3);
            return lerp(fracVec.y, x0, x1) * this.magnitude;
        }
    }
    var layers = [];
    function setup() {
        var id = ctx.createImageData(canvas.width, canvas.height);
        var d = id.data;
        layers.push(new PerlinLayer(4, 1));
        layers.push(new PerlinLayer(10, 1));
        layers.push(new PerlinLayer(10, 0.4));
        layers.push(new PerlinLayer(16, 0.2));
        layers.push(new PerlinLayer(32, 0.1));
        var min = Infinity;
        var max = -Infinity;
        var buffer = [];
        for (var x = 0; x < canvas.width; x++) {
            buffer.push([]);
            for (var y = 0; y < canvas.height; y++) {
                var val = 0;
                layers.forEach(element => {
                    val += element.value(x, y);
                });
                buffer[x].push(val);
                if (val < min) {
                    min = val;
                }
                if (val > max) {
                    max = val;
                }
            }
        }
        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                d[(y * canvas.width + x) * 4] = 0;
                d[(y * canvas.width + x) * 4 + 1] = (buffer[x][y] - min) / (max - min) * 255;
                d[(y * canvas.width + x) * 4 + 2] = 0;
                d[(y * canvas.width + x) * 4 + 3] = 255;
            }
        }
        ctx.putImageData(id, 0, 0);
        debugText.innerText =
            `max = ${max}
    min = ${min}`;
    }
    setup();
})(perlin || (perlin = {}));
