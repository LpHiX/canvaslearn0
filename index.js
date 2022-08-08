var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
var fpsMeter = document.getElementById("fpsMeter");
var debugText = document.getElementById("debugText");
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
    Vec2.randomVec2 = function (xMin, yMin, xMax, yMax) {
        return new Vec2(Math.random() * (xMax - xMin) + xMin, Math.random() * (yMax - yMin) + yMin);
    };
    Vec2.prototype.toString = function () {
        return "vec2(".concat(this.x, ", ").concat(this.y, ")");
    };
    return Vec2;
}());
var Circle = /** @class */ (function () {
    function Circle(pos, vel, radius) {
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
    }
    Circle.prototype.draw = function () {
        context.beginPath();
        context.strokeStyle = "#0FFFFF";
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    };
    Circle.prototype.update = function () {
        this.pos = this.pos.add(this.vel);
        if (this.pos.x % (canvas.width - this.radius) < this.radius) {
            this.vel.x *= -1;
        }
        if (this.pos.y % (canvas.height - this.radius) < this.radius) {
            this.vel.y *= -1;
        }
    };
    return Circle;
}());
var Grid = /** @class */ (function () {
    function Grid(minX, minY, maxX, maxY) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.xRange = this.maxX - this.minX;
        this.yRange = this.maxY - this.minY;
    }
    Grid.prototype.gridToCanvas = function (coord) {
        var x = canvas.width / 2 + coord.x / this.xRange * 2 * canvas.width / 2;
        var y = canvas.height / 2 - coord.y / this.yRange * 2 * canvas.height / 2;
        return new Vec2(x, y);
    };
    Grid.prototype.canvasToGrid = function (coord) {
        var x = coord.x * 2 / canvas.width - 1;
        var y = coord.y * 2 / canvas.height - 1;
        return new Vec2(x * this.xRange / 2, -y * this.yRange / 2);
    };
    Grid.prototype.drawMajorGrid = function () {
        context.strokeStyle = "#0FFFFF";
        var xGridStart = this.gridToCanvas(new Vec2(this.minX, 0));
        var xGridEnd = this.gridToCanvas(new Vec2(this.maxX, 0));
        var yGridStart = this.gridToCanvas(new Vec2(0, this.minY));
        var yGridEnd = this.gridToCanvas(new Vec2(0, this.maxY));
        context.beginPath();
        context.moveTo(xGridStart.x, xGridStart.y);
        context.lineTo(xGridEnd.x, xGridEnd.y);
        context.stroke();
        context.beginPath();
        context.moveTo(yGridStart.x, yGridStart.y);
        context.lineTo(yGridEnd.x, yGridEnd.y);
        context.stroke();
    };
    Grid.prototype.drawMinorGrid = function (gridSize) {
        for (var sign = -1; sign <= 1; sign += 2) {
            for (var i = 1; i < canvas.width / 2 / gridSize; i++) {
                var xGridStart = this.gridToCanvas(new Vec2(this.minX, i * gridSize * sign));
                var xGridEnd = this.gridToCanvas(new Vec2(this.maxX, i * gridSize * sign));
                var yGridStart = this.gridToCanvas(new Vec2(i * gridSize * sign, this.minY));
                var yGridEnd = this.gridToCanvas(new Vec2(i * gridSize * sign, this.maxY));
                context.strokeStyle = "#FFFFFF";
                context.beginPath();
                context.moveTo(xGridStart.x, xGridStart.y);
                context.lineTo(xGridEnd.x, xGridEnd.y);
                context.stroke();
                context.beginPath();
                context.moveTo(yGridStart.x, yGridStart.y);
                context.lineTo(yGridEnd.x, yGridEnd.y);
                context.stroke();
            }
        }
        context.beginPath();
        context.moveTo(this.minX, this.minY);
    };
    return Grid;
}());
var circles = [];
var mouseX, mouseY, grid, previousFrameTime;
function canvasClicked(event) {
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    circles.push(new Circle(new Vec2(mouseX, mouseY), Vec2.randomVec2(-1, -1, 1, 1), 140));
    debugText.innerText =
        new Vec2(mouseX, mouseY).toString() + " Original canvas coordinates \n" +
            grid.canvasToGrid(new Vec2(mouseX, mouseY)).toString() + " Grid coordinates \n" +
            grid.gridToCanvas(grid.canvasToGrid(new Vec2(mouseX, mouseY))).toString() + " Calculated canvas coordinates";
}
function setup() {
    grid = new Grid(-10, -10, 10, 10);
    for (var i = 0; i < 10; i++) {
        circles.push(new Circle(Vec2.randomVec2(100, 100, canvas.width - 100, canvas.height - 100), Vec2.randomVec2(-1, -1, 1, 1), 10));
    }
    canvas.addEventListener("click", canvasClicked);
}
function frameUpdate(timestamp) {
    fpsMeter.textContent = (1 / ((timestamp - previousFrameTime) / 1000)).toString();
    previousFrameTime = timestamp;
    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    var imageData = context.createImageData(canvas.width, canvas.height);
    var data = imageData.data;
    grid.drawMajorGrid();
    grid.drawMinorGrid(1);
    circles.forEach(function (element) {
        element.draw();
        element.update();
    });
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
