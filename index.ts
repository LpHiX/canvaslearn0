const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const fpsMeter = document.getElementById("fpsMeter") as HTMLDivElement;
const debugText = document.getElementById("debugText") as HTMLDivElement;
 
class Vec2{
    x: number;
    y: number;
    constructor(x:number, y:number)
    {
        this.x = x;
        this.y = y;
    }
    add(other: Vec2):Vec2{
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    mul(scalar: number):Vec2{
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    toString():string{
        return `vec2(${this.x}, ${this.y})`;
    }
}
class Grid{
    size: number;
    canvasMin: number;
    constructor(size:number){
        this.size = size;
        this.canvasMin = Math.min(canvas.width, canvas.height);
    }
    gridToCanvas(coord: Vec2): Vec2{
        let x = canvas.width / 2 + coord.x / this.size * this.canvasMin / 2;
        let y = canvas.height / 2 - coord.y / this.size * this.canvasMin / 2;
        return new Vec2(x,y);
    }
    canvasToGrid(coord: Vec2): Vec2{
        var x = coord.x * 2 - canvas.width;
        var y = coord.y * 2 - canvas.height;
        return new Vec2(x,-y).mul(this.size / this.canvasMin);
    }
    drawMinorGrid(gridSize:number) {
        context.strokeStyle = "rgb(50, 100, 200)";
        for(var sign = -1; sign <= 1; sign += 2) {
            for (let i = 1; i < this.size / gridSize * canvas.height / this.canvasMin; i++) {
                let MinX = this.gridToCanvas(new Vec2(-this.size * canvas.width / this.canvasMin, i * gridSize * sign))
                let MaxX = this.gridToCanvas(new Vec2(this.size * canvas.width / this.canvasMin, i * gridSize * sign))
 
                context.beginPath()
                context.moveTo(MinX.x, MinX.y);
                context.lineTo(MaxX.x, MaxX.y);
                context.stroke();
                }
                for (let i = 1; i < this.size / gridSize * canvas.width / this.canvasMin; i++) {
                    let MinY = this.gridToCanvas(new Vec2(i * gridSize * sign, -this.size * canvas.height / this.canvasMin))
                    let MaxY = this.gridToCanvas(new Vec2(i * gridSize * sign, this.size * canvas.height / this.canvasMin))
 
                    context.beginPath()
                    context.moveTo(MinY.x, MinY.y);
                    context.lineTo(MaxY.x, MaxY.y);
                    context.stroke();
                }   
            }
    }
    drawMajorGrid() {
        let MinX = this.gridToCanvas(new Vec2(-this.size * canvas.width / this.canvasMin, 0))
        let MaxX = this.gridToCanvas(new Vec2(this.size * canvas.width / this.canvasMin, 0))
        let MinY = this.gridToCanvas(new Vec2(0, -this.size * canvas.height / this.canvasMin))
        let MaxY = this.gridToCanvas(new Vec2(0, this.size * canvas.height / this.canvasMin))
 
        context.beginPath()
        context.strokeStyle = "rgb(200, 200, 200)";
        context.moveTo(MinX.x, MinX.y);
        context.lineTo(MaxX.x, MaxX.y);
        context.stroke();
 
        context.beginPath()
        context.moveTo(MinY.x, MinY.y);
        context.lineTo(MaxY.x, MaxY.y);
        context.stroke();
    }
}
function funcValue(x: number, y: number):number{
    return (y - x * x / 2) + 15;
}
 
class SubGrid{
    gridSize:number;
    constructor(gridSize: number){
        this.gridSize = gridSize;
    }
    forEachCorner(func: Function){
        let maxXIndex = Math.floor(grid.size / this.gridSize * canvas.width / grid.canvasMin);
        let maxYIndex = Math.floor(grid.size / this.gridSize * canvas.height / grid.canvasMin);
        for(let y = -maxYIndex; y <= maxYIndex; y++){
            for(let x = -maxXIndex; x <= maxXIndex; x++){
                func(x*this.gridSize,y*this.gridSize);
            }
        }
    }
    showValue(x:number,y:number): void{
        let val = funcValue(x,y);
        let coord = grid.gridToCanvas(new Vec2(x,y));
        context.strokeStyle = `rgb(0, ${val >= 0 ? 255 : 0}, 0)`
        context.beginPath();
        context.arc(coord.x, coord.y, 3, 0, 2 * Math.PI);
        context.stroke();
    }
}
function canvasClick(event: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    const clickedCoord = new Vec2(event.clientX - rect.left, event.clientY - rect.top);
    const toGridCoord = grid.canvasToGrid(clickedCoord);
    const toCanvasCoord = grid.gridToCanvas(toGridCoord);
    debugText.innerText = 
    `
    ${clickedCoord} Original 
    ${toGridCoord} To Grid
    ${toCanvasCoord} To Canvas
    `;
}
 
var lastFrameTime: number, grid: Grid, subGrid:SubGrid;
 
function setup(){
    grid = new Grid(10);
    subGrid = new SubGrid(1);
    canvas.addEventListener("mousedown", canvasClick);
 
    context.fillStyle = "rgb(30,40,50)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    grid.drawMajorGrid();
    grid.drawMinorGrid(2);
 
    subGrid.forEachCorner(subGrid.showValue)
}
function frameUpdate(timestamp: number){
    fpsMeter.innerText = (1 / ((timestamp - lastFrameTime) / 1000)).toString();
    lastFrameTime = timestamp;
 
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);