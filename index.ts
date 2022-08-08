const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext('2d') as CanvasRenderingContext2D;

const fpsMeter = document.getElementById("fpsMeter") as HTMLDivElement;
const debugText = document.getElementById("debugText") as HTMLDivElement;

class Vec2{
    x:number;
    y:number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    add(other: Vec2):Vec2{
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    mul(scalar:number):Vec2{
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    static randomVec2(xMin, yMin, xMax, yMax):Vec2{
       return new Vec2(Math.random() * (xMax - xMin) + xMin, Math.random() * (yMax - yMin) + yMin);
    }
    toString(): string{
        return `vec2(${this.x}, ${this.y})`;
    }
}
class Circle{
    pos:Vec2;
    vel:Vec2;
    radius:number;
    constructor(pos:Vec2, vel:Vec2, radius){
        this.pos = pos;
        this.vel = vel;
        this.radius = radius;
    }
    draw(): void{
        context.beginPath();
        context.strokeStyle = "#0FFFFF"
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.stroke();
    }
    update(): void{
        this.pos = this.pos.add(this.vel);
        if(this.pos.x % (canvas.width - this.radius) < this.radius){
            this.vel.x *= -1;
        }
        if(this.pos.y % (canvas.height - this.radius) < this.radius){
            this.vel.y *= -1;
        }
    }
}
class Grid{
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    xRange: number;
    yRange: number;
    constructor(minX:number, minY:number, maxX:number, maxY:number){
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.xRange = this.maxX - this.minX;
        this.yRange = this.maxY - this.minY;
    }
    gridToCanvas(coord:Vec2):Vec2 {
        let x = canvas.width / 2 + coord.x / this.xRange * 2 * canvas.width / 2;
        let y = canvas.height / 2 - coord.y / this.yRange * 2 * canvas.height /2;
        return new Vec2(x,y);
    }
    canvasToGrid(coord:Vec2):Vec2 {
        let x = coord.x * 2 / canvas.width - 1;
        let y = coord.y * 2 / canvas.height - 1;
        return new Vec2(x * this.xRange / 2,-y * this.yRange / 2);
    }
    drawMajorGrid(): void{
        context.strokeStyle = "#0FFFFF"
        const xGridStart = this.gridToCanvas(new Vec2(this.minX, 0));
        const xGridEnd = this.gridToCanvas(new Vec2(this.maxX, 0));
        const yGridStart = this.gridToCanvas(new Vec2(0, this.minY));
        const yGridEnd = this.gridToCanvas(new Vec2(0, this.maxY));
        context.beginPath();
        context.moveTo(xGridStart.x, xGridStart.y)
        context.lineTo(xGridEnd.x, xGridEnd.y)
        context.stroke();

        context.beginPath();
        context.moveTo(yGridStart.x, yGridStart.y)
        context.lineTo(yGridEnd.x, yGridEnd.y)
        context.stroke();
    }
    drawMinorGrid(gridSize:number): void{
        for (let sign = -1; sign <= 1; sign += 2){
            for (let i = 1; i < canvas.width / 2 / gridSize; i++) {
                const xGridStart = this.gridToCanvas(new Vec2(this.minX, i * gridSize * sign));
                const xGridEnd = this.gridToCanvas(new Vec2(this.maxX, i * gridSize * sign));
                const yGridStart = this.gridToCanvas(new Vec2(i * gridSize * sign, this.minY));
                const yGridEnd = this.gridToCanvas(new Vec2(i * gridSize * sign, this.maxY));
                context.strokeStyle = "#FFFFFF"
                context.beginPath();
                context.moveTo(xGridStart.x, xGridStart.y); 
                context.lineTo(xGridEnd.x, xGridEnd.y)
                context.stroke();

                context.beginPath();
                context.moveTo(yGridStart.x, yGridStart.y)
                context.lineTo(yGridEnd.x, yGridEnd.y)
                context.stroke();
            }
        }
        context.beginPath();
        context.moveTo(this.minX, this.minY);
    }
}

var circles: Circle[] = [];
var mouseX:number, mouseY:number, grid:Grid, previousFrameTime:number;

function canvasClicked(event:MouseEvent){
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    circles.push(new Circle(new Vec2(mouseX, mouseY), Vec2.randomVec2(-1, -1, 1, 1), 140))
    debugText.innerText = 
    new Vec2(mouseX, mouseY).toString() + " Original canvas coordinates \n" +
    grid.canvasToGrid(new Vec2(mouseX, mouseY)).toString() + " Grid coordinates \n" +
    grid.gridToCanvas(grid.canvasToGrid(new Vec2(mouseX, mouseY))).toString() + " Calculated canvas coordinates";
}


function setup(){
    grid = new Grid(-10, -10, 10, 10);
    for (let i = 0; i < 10; i++) {
        circles.push(new Circle(Vec2.randomVec2(100, 100, canvas.width-100, canvas.height-100), Vec2.randomVec2(-1, -1, 1, 1), 10));
    }
    canvas.addEventListener("click", canvasClicked);
}

function frameUpdate(timestamp){
    fpsMeter.textContent = (1 / ((timestamp - previousFrameTime)/ 1000)).toString();
    previousFrameTime = timestamp;

    context.fillStyle = "rgb(0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var imageData = context.createImageData(canvas.width, canvas.height);
    var data = imageData.data;

    grid.drawMajorGrid();
    grid.drawMinorGrid(1);

    circles.forEach(element => {
        element.draw();
        element.update();
    });
    window.requestAnimationFrame(frameUpdate);
}

setup();
window.requestAnimationFrame(frameUpdate);