var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
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
    Vec2.prototype.toString = function () {
        return "vec2(".concat(this.x, ", ").concat(this.y, ")");
    };
    return Vec2;
}());
var Grid = /** @class */ (function () {
    function Grid(size) {
        this.size = size;
        this.canvasMin = Math.min(canvas.width, canvas.height);
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
    return (y - x * x / 2) + 15;
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
        context.strokeStyle = "rgb(0, ".concat(val >= 0 ? 255 : 0, ", 0)");
        context.beginPath();
        context.arc(coord.x, coord.y, 3, 0, 2 * Math.PI);
        context.stroke();
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
var lastFrameTime, grid, subGrid;
function setup() {
    grid = new Grid(10);
    subGrid = new SubGrid(1);
    canvas.addEventListener("mousedown", canvasClick);
    context.fillStyle = "rgb(30,40,50)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    grid.drawMajorGrid();
    grid.drawMinorGrid(2);
    subGrid.forEachCorner(subGrid.showValue);
}
function frameUpdate(timestamp) {
    fpsMeter.innerText = (1 / ((timestamp - lastFrameTime) / 1000)).toString();
    lastFrameTime = timestamp;
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
