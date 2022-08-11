namespace marchingsquares{
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const fpsMeter = document.getElementById("fpsMeter") as HTMLDivElement;
const debugText = document.getElementById("debugText") as HTMLDivElement;

const squareLookup = [
    [],
    [0,1],
    [0,2],
    [1,2],
    [1,3],
    [0,3],
    [4],
    [2,3],
    [2,3],
    [5],
    [0,3],
    [1,3],
    [1,2],
    [0,2],
    [0,1],
    []
];

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
    static randomVec(minX:number, minY:number, maxX:number, maxY:number):Vec2{
        return new Vec2(Math.random() * (maxX - minX) + minX, Math.random() * (maxY - minY) + minY);
    }
}
class Circle{
    constructor(
        public pos:Vec2,
        public vel:Vec2,
        public radius:number
    ){}
    anim(): void{
        if(this.pos.x - this.radius < -grid.xLim || this.pos.x + this.radius> grid.xLim){
            this.vel.x *= -1;
        }
        if(this.pos.y - this.radius < -grid.yLim || this.pos.y + this.radius> grid.yLim){
            this.vel.y *= -1;
        }
        this.pos = this.pos.add(this.vel);
    }
    draw(): void{
        context.strokeStyle = 'rgb(255, 0, 0)';
        context.beginPath();
        context.arc(grid.gridToCanvasX(this.pos.x), grid.gridToCanvasY(this.pos.y), this.radius * grid.canvasMin / grid.size / 2, 0, 2 * Math.PI);
        context.stroke();
    }
}
class Grid{
    size: number;
    canvasMin: number;
    xLim: number;
    yLim: number;
    constructor(size:number){
        this.size = size;
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.xLim = this.size * canvas.width / this.canvasMin;
        this.yLim = this.size * canvas.height / this.canvasMin;
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
    gridToCanvasX(x: number): number{
        return canvas.width / 2 + x / this.size * this.canvasMin / 2;
    }
    gridToCanvasY(y: number): number{
        return canvas.height / 2 - y / this.size * this.canvasMin / 2;
    }
    moveTo(gridCoord: Vec2): void{
        context.moveTo(this.gridToCanvasX(gridCoord.x), this.gridToCanvasY(gridCoord.y));
    }
    lineTo(gridCoord: Vec2): void{
        context.lineTo(this.gridToCanvasX(gridCoord.x), this.gridToCanvasY(gridCoord.y));
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
    //return (x * x + y * y - 10) % 15 - 5;
    //return (y - x * x / 1)
    //return y - x * x / 2 - 2 + x * x * x * x / 150 + Math.exp(-y/3) - 5 * Math.sin(5 *x);
    let val = -1;
    circles.forEach(circle => {
        val += circle.radius / Math.sqrt((x - circle.pos.x) * (x - circle.pos.x) + (y -circle.pos.y) * (y - circle.pos.y));
    });
    return val;
}
function lerpNum(alpha:number, a:number, b:number):number{
    return a + (b - a) * 0.5;
}
function lerpVec(alpha:number, a:Vec2, b:Vec2):Vec2{
    return a.add(b.add(a.mul(-1)).mul(alpha));
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
        context.strokeStyle = `rgb(0, 0, ${val >= thresh ? 255 :  0})`
        context.beginPath();
        context.arc(coord.x, coord.y, 3, 0, 2 * Math.PI);
        context.stroke();
    }
    marchingSquares(x:number, y:number): void{
        var squareIndex = 0;
                
        let corner0 = funcValue(x,y);
        let corner1 = funcValue(x + this.gridSize,y);
        let corner2 = funcValue(x,y + this.gridSize);
        let corner3 = funcValue(x + this.gridSize,y + this.gridSize);

        if(corner0 >= thresh){squareIndex += 1;}
        if(corner1 >= thresh){squareIndex += 2;}
        if(corner2 >= thresh){squareIndex += 4;}
        if(corner3 >= thresh){squareIndex += 8;}
        switch (squareLookup[squareIndex].length) {
            case 1:
                break;
            case 2:
                let lineLookup = [
                    lerpVec(-corner0 / (-corner0 + corner1), new Vec2(x, y), new Vec2(x + this.gridSize, y)),
                    lerpVec(-corner0 / (-corner0 + corner2), new Vec2(x, y), new Vec2(x, y + this.gridSize)),
                    lerpVec(-corner1 / (-corner1 + corner3), new Vec2(x + this.gridSize, y), new Vec2(x + this.gridSize, y + this.gridSize)),
                    lerpVec(-corner2 / (-corner2 + corner3), new Vec2(x, y + this.gridSize), new Vec2(x + this.gridSize, y + this.gridSize))
                ]
                
                context.strokeStyle = `rgb(0, 255, 0)`;
                context.beginPath();
                grid.moveTo(lineLookup[squareLookup[squareIndex][0]]);
                grid.lineTo(lineLookup[squareLookup[squareIndex][1]]);
                context.stroke();
                break;
            default:
                break;
        }
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
 
var lastFrameTime: number, grid: Grid, subGrid:SubGrid, subGrid2:SubGrid;
var circles: Circle[] = [];
const thresh = 0;
 
function setup(){
    grid = new Grid(20);
    subGrid = new SubGrid(1);
    canvas.addEventListener("mousedown", canvasClick);
    for(let i = 0; i < 10; i++){
        circles.push(new Circle(Vec2.randomVec(-15, -15, 15, 15), Vec2.randomVec(-0.1, -.1, .1, .1).mul(1), 1))
    }
}
function frameUpdate(timestamp: number){
    fpsMeter.innerText = (1 / ((timestamp - lastFrameTime) / 1000)).toString();
    lastFrameTime = timestamp;
 
    context.fillStyle = "rgb(30,40,50)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    grid.drawMajorGrid();
    grid.drawMinorGrid(0.5);

    //subGrid.forEachCorner(subGrid.showValue.bind(subGrid));
    subGrid.forEachCorner(subGrid.marchingSquares.bind(subGrid));

    circles.forEach(element => {
        element.anim();
        //element.draw();
    });

    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
}