const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const debugText = document.getElementById("debugText") as HTMLDivElement;
const fpsMeter = document.getElementById("fpsMeter") as HTMLDivElement;
const timeStep = 1 / 60;

function mod(a:number, b:number):number{
    return a - Math.floor(a / b) * b;
}
class Line{
    constructor(
        public min: number,
        public angle: number
    ){}
}

class Car {
    public vel: number
    constructor(
        public x: number,
        public y: number,
        public angle: number
    ){
        this.vel = 0;
    }
    draw(): void{
        ctx.strokeStyle = "rgb(0, 255, 0)";

        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, this.angle - 1, this.angle + 1);
        ctx.closePath();
        ctx.stroke();

    }
    lineTest(walls:Wall[], angle: number): number{
        var tan = Math.tan(angle);
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var min = 200;
        for(var i = 0; i < walls.length; i++){
            var upper = (walls[i].y1 - this.y)/tan + this.x;
            var lower = (walls[i].y2 - this.y)/tan + this.x;
            var left = (walls[i].x1 - this.x) * tan + this.y;
            var right = (walls[i].x2 - this.x) * tan + this .y;
            if(upper > walls[i].x1 && upper < walls[i].x2 && mod(angle, (2 * Math.PI)) < Math.PI && this.y < walls[i].y1){
                var dist = (upper - this.x) / cos;
                min = dist < min ? dist : min;
                
            }
            if(lower > walls[i].x1 && lower < walls[i].x2 && mod(angle, (2 * Math.PI)) > Math.PI && this.y > walls[i].y2){
                var dist = (lower - this.x) / cos;
                min = dist < min ? dist : min;
            }
            if(left > walls[i].y1 && left < walls[i].y2 && mod((angle + Math.PI / 2), (2 * Math.PI)) < Math.PI && this.x < walls[i].x1){
                var dist = (left - this.y) / sin;
                min = dist < min ? dist : min;
            }
            if(right > walls[i].y1 && right < walls[i].y2 && mod(angle + Math.PI / 2, (2 * Math.PI)) > Math.PI && this.x > walls[i].x2){
                var dist = (right - this.y) / sin;
                min = dist < min ? dist : min;
            }
        }
        return min;
    }
    accelerate(): void{
        this.vel += 0.1;
    }
    brake(): void{
        if(this.vel > 0){
            this.vel -= 0.1;
        } else{
            this.vel = 0;
        }
    }
    turnLeft(): void{
        this.angle -= 0.01;
    }
    turnRight(): void{
        this.angle += 0.01;
    }
    update(walls:Wall[]): void{
        this.x += this.vel * timeStep * Math.cos(this.angle);
        this.y += this.vel * timeStep * Math.sin(this.angle);
        this.draw();
        var lines = [
            new Line(this.lineTest(walls, this.angle - 0.4), this.angle - 0.4),
            new Line(this.lineTest(walls, this.angle - 0.2), this.angle - 0.2),
            new Line(this.lineTest(walls, this.angle      ), this.angle      ),
            new Line(this.lineTest(walls, this.angle + 0.2), this.angle + 0.2),
            new Line(this.lineTest(walls, this.angle + 0.4), this.angle + 0.4),
        ]
        if(lines[1].min > 199 && lines[2].min > 199 && lines[3].min > 199){
            this.accelerate();
        } else{
            this.brake();
        }

        if(lines[0].min > 199){
            this.turnLeft();
        }
        if(lines[4].min > 199){
            this.turnRight
        }
        lines.forEach(line => {
            if(line.min < 200){
                ctx.strokeStyle = "rgb(255, 0, 0)";
            } else{
                ctx.strokeStyle = "rgb(0, 255, 0)";
            }

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + line.min * Math.cos(line.angle), this.y + line.min * Math.sin(line.angle))
            ctx.closePath();
            ctx.stroke();
        })
    }
}
class Wall {
    constructor(
        public x1: number,
        public y1: number,
        public x2: number,
        public y2: number
    ){}
    draw(){
        ctx.fillStyle = "rgb(0, 150, 255)";
        ctx.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1)
        
    }

}

const car = new Car(250, 450, 0);
const testWalls = [
    new Wall(0, 0, 500, 10),
    new Wall(0, 0, 10, 500),
    new Wall(0, 490, 500, 500),
    new Wall(490, 0, 500, 500),

    new Wall(150, 150, 350, 350),
]

function main(timestamp: number){
    ctx.fillStyle = "rgb(30, 40, 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    car.update(testWalls);
    testWalls.forEach(wall =>{
        wall.draw();
    })

    fpsMeter.innerText = (performance.now() - timestamp).toString();
    requestAnimationFrame(main);
}
requestAnimationFrame(main);
