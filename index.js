var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var fpsMeter = document.getElementById("fpsMeter");
var debugText = document.getElementById("debugText");
var squareLookup = [
    [],
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
    [0, 3],
    [4],
    [2, 3],
    [2, 3],
    [5],
    [0, 3],
    [1, 3],
    [1, 2],
    [0, 2],
    [0, 1],
    []
];
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
    Vec2.prototype.toString = function () {
        return "vec2(".concat(this.x, ", ").concat(this.y, ")");
    };
    Vec2.randomVec = function (minX, minY, maxX, maxY) {
        return new Vec2(Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY);
    };
    return Vec2;
}());
var Circle = /** @class */ (function () {
    function Circle(pos, vel, radius) {
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
    }
    Circle.prototype.anim = function () {
        if (this.pos.x - this.radius < -grid.xLim || this.pos.x + this.radius > grid.xLim) {
            this.vel.x *= -1;
        }
        if (this.pos.y - this.radius < -grid.yLim || this.pos.y + this.radius > grid.yLim) {
            this.vel.y *= -1;
        }
        this.pos = this.pos.add(this.vel);
    };
    Circle.prototype.draw = function () {
        context.strokeStyle = 'rgb(255, 0, 0)';
        context.beginPath();
        context.arc(grid.gridToCanvasX(this.pos.x), grid.gridToCanvasY(this.pos.y), this.radius * grid.canvasMin / grid.size / 2, 0, 2 * Math.PI);
        context.stroke();
    };
    return Circle;
}());
var Grid = /** @class */ (function () {
    function Grid(size) {
        this.size = size;
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.xLim = this.size * canvas.width / this.canvasMin;
        this.yLim = this.size * canvas.height / this.canvasMin;
    }
    Grid.prototype.gridToCanvas = function (coord) {
        var x = canvas.width / 2 + coord.x / this.size * this.canvasMin / 2;
        var y = canvas.height / 2 - coord.y / this.size * this.canvasMin / 2;
        return new Vec2(x, y);
    };
    Grid.prototype.canvasToGrid = function (coord) {
        var x = coord.x * 2 - canvas.width;
        var y = coord.y * 2 - canvas.height;
        return new Vec2(x, -y).mul(this.size / this.canvasMin);
    };
    Grid.prototype.gridToCanvasX = function (x) {
        return canvas.width / 2 + x / this.size * this.canvasMin / 2;
    };
    Grid.prototype.gridToCanvasY = function (y) {
        return canvas.height / 2 - y / this.size * this.canvasMin / 2;
    };
    Grid.prototype.moveTo = function (gridCoord) {
        context.moveTo(this.gridToCanvasX(gridCoord.x), this.gridToCanvasY(gridCoord.y));
    };
    Grid.prototype.lineTo = function (gridCoord) {
        context.lineTo(this.gridToCanvasX(gridCoord.x), this.gridToCanvasY(gridCoord.y));
    };
    Grid.prototype.drawMinorGrid = function (gridSize) {
        context.strokeStyle = "rgb(50, 100, 200)";
        for (var sign = -1; sign <= 1; sign += 2) {
            for (var i = 1; i < this.size / gridSize * canvas.height / this.canvasMin; i++) {
                var MinX = this.gridToCanvas(new Vec2(-this.size * canvas.width / this.canvasMin, i * gridSize * sign));
                var MaxX = this.gridToCanvas(new Vec2(this.size * canvas.width / this.canvasMin, i * gridSize * sign));
                context.beginPath();
                context.moveTo(MinX.x, MinX.y);
                context.lineTo(MaxX.x, MaxX.y);
                context.stroke();
            }
            for (var i = 1; i < this.size / gridSize * canvas.width / this.canvasMin; i++) {
                var MinY = this.gridToCanvas(new Vec2(i * gridSize * sign, -this.size * canvas.height / this.canvasMin));
                var MaxY = this.gridToCanvas(new Vec2(i * gridSize * sign, this.size * canvas.height / this.canvasMin));
                context.beginPath();
                context.moveTo(MinY.x, MinY.y);
                context.lineTo(MaxY.x, MaxY.y);
                context.stroke();
            }
        }
    };
    Grid.prototype.drawMajorGrid = function () {
        var MinX = this.gridToCanvas(new Vec2(-this.size * canvas.width / this.canvasMin, 0));
        var MaxX = this.gridToCanvas(new Vec2(this.size * canvas.width / this.canvasMin, 0));
        var MinY = this.gridToCanvas(new Vec2(0, -this.size * canvas.height / this.canvasMin));
        var MaxY = this.gridToCanvas(new Vec2(0, this.size * canvas.height / this.canvasMin));
        context.beginPath();
        context.strokeStyle = "rgb(200, 200, 200)";
        context.moveTo(MinX.x, MinX.y);
        context.lineTo(MaxX.x, MaxX.y);
        context.stroke();
        context.beginPath();
        context.moveTo(MinY.x, MinY.y);
        context.lineTo(MaxY.x, MaxY.y);
        context.stroke();
    };
    return Grid;
}());
function funcValue(x, y) {
    //return (x * x + y * y - 10) % 15 - 5;
    //return (y - x * x / 1)
    //return y - x * x / 2 - 2 + x * x * x * x / 150 + Math.exp(-y/3) - 5 * Math.sin(5 *x);
    var val = -1;
    circles.forEach(function (circle) {
        val += circle.radius / Math.sqrt((x - circle.pos.x) * (x - circle.pos.x) + (y - circle.pos.y) * (y - circle.pos.y));
    });
    return val;
}
function lerpNum(alpha, a, b) {
    return a + (b - a) * 0.5;
}
function lerpVec(alpha, a, b) {
    return a.add(b.add(a.mul(-1)).mul(alpha));
}
var SubGrid = /** @class */ (function () {
    function SubGrid(gridSize) {
        this.gridSize = gridSize;
    }
    SubGrid.prototype.forEachCorner = function (func) {
        var maxXIndex = Math.floor(grid.size / this.gridSize * canvas.width / grid.canvasMin);
        var maxYIndex = Math.floor(grid.size / this.gridSize * canvas.height / grid.canvasMin);
        for (var y = -maxYIndex; y <= maxYIndex; y++) {
            for (var x = -maxXIndex; x <= maxXIndex; x++) {
                func(x * this.gridSize, y * this.gridSize);
            }
        }
    };
    SubGrid.prototype.showValue = function (x, y) {
        var val = funcValue(x, y);
        var coord = grid.gridToCanvas(new Vec2(x, y));
        context.strokeStyle = "rgb(0, 0, ".concat(val >= thresh ? 255 : 0, ")");
        context.beginPath();
        context.arc(coord.x, coord.y, 3, 0, 2 * Math.PI);
        context.stroke();
    };
    SubGrid.prototype.marchingSquares = function (x, y) {
        var squareIndex = 0;
        var corner0 = funcValue(x, y);
        var corner1 = funcValue(x + this.gridSize, y);
        var corner2 = funcValue(x, y + this.gridSize);
        var corner3 = funcValue(x + this.gridSize, y + this.gridSize);
        if (corner0 >= thresh) {
            squareIndex += 1;
        }
        if (corner1 >= thresh) {
            squareIndex += 2;
        }
        if (corner2 >= thresh) {
            squareIndex += 4;
        }
        if (corner3 >= thresh) {
            squareIndex += 8;
        }
        switch (squareLookup[squareIndex].length) {
            case 1:
                break;
            case 2:
                var lineLookup = [
                    lerpVec(-corner0 / (-corner0 + corner1), new Vec2(x, y), new Vec2(x + this.gridSize, y)),
                    lerpVec(-corner0 / (-corner0 + corner2), new Vec2(x, y), new Vec2(x, y + this.gridSize)),
                    lerpVec(-corner1 / (-corner1 + corner3), new Vec2(x + this.gridSize, y), new Vec2(x + this.gridSize, y + this.gridSize)),
                    lerpVec(-corner2 / (-corner2 + corner3), new Vec2(x, y + this.gridSize), new Vec2(x + this.gridSize, y + this.gridSize))
                ];
                context.strokeStyle = "rgb(0, 255, 0)";
                context.beginPath();
                grid.moveTo(lineLookup[squareLookup[squareIndex][0]]);
                grid.lineTo(lineLookup[squareLookup[squareIndex][1]]);
                context.stroke();
                break;
            default:
                break;
        }
    };
    return SubGrid;
}());
function canvasClick(event) {
    var rect = canvas.getBoundingClientRect();
    var clickedCoord = new Vec2(event.clientX - rect.left, event.clientY - rect.top);
    var toGridCoord = grid.canvasToGrid(clickedCoord);
    var toCanvasCoord = grid.gridToCanvas(toGridCoord);
    debugText.innerText =
        "\n    ".concat(clickedCoord, " Original \n    ").concat(toGridCoord, " To Grid\n    ").concat(toCanvasCoord, " To Canvas\n    ");
}
var lastFrameTime, grid, subGrid, subGrid2;
var circles = [];
var thresh = 0;
function setup() {
    grid = new Grid(20);
    subGrid = new SubGrid(0.5);
    canvas.addEventListener("mousedown", canvasClick);
    for (var i = 0; i < 10; i++) {
        circles.push(new Circle(Vec2.randomVec(-15, -15, 15, 15), Vec2.randomVec(-0.1, -.1, .1, .1).mul(1), 1));
    }
}
function frameUpdate(timestamp) {
    fpsMeter.innerText = (1 / ((timestamp - lastFrameTime) / 1000)).toString();
    lastFrameTime = timestamp;
    context.fillStyle = "rgb(30,40,50)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    grid.drawMajorGrid();
    grid.drawMinorGrid(0.5);
    //subGrid.forEachCorner(subGrid.showValue.bind(subGrid));
    subGrid.forEachCorner(subGrid.marchingSquares.bind(subGrid));
    circles.forEach(function (element) {
        element.anim();
        //element.draw();
    });
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
