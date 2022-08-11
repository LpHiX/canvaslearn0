namespace camera3d{
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const debugText = document.getElementById("debugText") as HTMLDivElement;

class projection{
    constructor(){}
}
class Vec2{
    constructor(
        public x: number,
        public y: number
     ){}
     mul(scalar:number):Vec2{
         return new Vec2(this.x * scalar, this.y * scalar);
     }
}
class Vec3{
    constructor(
       public x: number,
       public y: number,
       public z: number,
    ){}
    mul(scalar:number):Vec3{
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
}
class Camera{
    constructor(
        public pos:Vec3,
        public angleZ: number,
        public angleX: number
    ){}
}
class UV{
    canvasMin:number;
    constructor(
        public size:number
    ){
        this.canvasMin = Math.min(canvas.width, canvas.height);
    }
    c2g(coord:Vec2): Vec2{
        return new Vec3(coord.x / canvas.width * 2 - 1,1 - coord.y / canvas.height * 2, 0).mul(this.size);
    }
    g2c(coord:Vec2):Vec2{
        return new Vec3(canvas.width / 2 + coord.x / this.size * canvas.width / 2, canvas.height / 2 - coord.y / this.size * canvas.height / 2, 0)
    }
    vecToGrid(coord: Vec3):Vec2{
        return new Vec2(coord.x / coord.z, coord.y / coord.z);
    }
}
const cube=[
    new Vec3(1, 1, 5),
    new Vec3(3, 1, 5),
    new Vec3(3, 3, 5),
    new Vec3(1, 3, 5),
    new Vec3(1, 1, 7),
    new Vec3(3, 1, 7),
    new Vec3(3, 3, 7),
    new Vec3(1, 3, 7)
];
const uv = new UV(4);

function setup(){
    ctx.fillStyle = "rgb(30, 40, 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
}
function frameUpdate(timestamp:number){
    ctx.strokeStyle = "rgb(0, 255, 100)";
    cube.forEach(point =>{
        const tempPoint = new Vec3(point.x + 4 * Math.cos(timestamp/10), point.y, point.z + 4 * Math.sin(timestamp/10));
        ctx.beginPath();
        const point2d = uv.g2c(uv.vecToGrid(tempPoint));
        ctx.arc(point2d.x, point2d.y, 1, 0, Math.PI * 2)
        ctx.stroke()
    });

    ctx.beginPath();
    const zero = uv.g2c(new Vec3(0,0,0));
    ctx.arc(zero.x, zero.y, 1, 0, Math.PI * 2)
    ctx.stroke()

    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
}