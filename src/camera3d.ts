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
        public angleY: number,
        public angleX: number
    ){}
}
class Util{
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
        return new Vec2(coord.x / (coord.z), coord.y / (coord.z));
    }
    rotZ(coord:Vec3, angle:number):Vec3{
        return new Vec3(coord.x * Math.cos(angle) - coord.y * Math.sin(angle), coord.x * Math.sin(angle) + coord.y * Math.cos(angle), coord.z);
    }
    rotX(coord:Vec3, angle:number):Vec3{
        return new Vec3(coord.x, coord.y * Math.cos(angle) - coord.z * Math.sin(angle), coord.y * Math.sin(angle) + coord.z * Math.cos(angle));
    }
    rotY(coord:Vec3, angle:number):Vec3{
        return new Vec3(coord.x * Math.cos(angle) - coord.z * Math.sin(angle), coord.y, coord.x * Math.sin(angle) + coord.z * Math.cos(angle));
    }
}
let down = false;
let startX = 0;
let startY = 0;
let premoveY = 0;
let premoveX = 0;
const cube=[
    new Vec3(-1, -1, 5),
    new Vec3( 1, -1, 5),
    new Vec3( 1,  1, 5),
    new Vec3( -1, 1, 5),
    new Vec3(-1, -1, 3),
    new Vec3( 1, -1, 3),
    new Vec3( 1,  1, 3),
    new Vec3( -1, 1, 3)
];
const util = new Util(4);
const cam = new Camera(new Vec3(0,0,-10), 0, 0);
function setup(){
    canvas.addEventListener("mousedown", function(event) {
        down = true;
        premoveX = cam.angleX;
        premoveY = cam.angleY;
        startX = event.clientX;
        startY = event.clientY;
    });
    canvas.addEventListener("mouseup", () => {
        down = false;
        premoveX = cam.angleX;
        premoveY = cam.angleY;
    });
    canvas.addEventListener("mousemove", function(event) {
        if(down){
            cam.angleY = premoveY + (event.clientX - startX) / 100;
            cam.angleX = premoveX + (event.clientY - startY) / 100;
        }
    });
}
function frameUpdate(timestamp:number){
    ctx.fillStyle = "rgb(30, 40, 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgb(0, 255, 100)";
    cube.forEach(point =>{
        const tempPoint = util.rotX(util.rotY(point, cam.angleY), cam.angleX);
        ctx.beginPath();
        const point2d = util.g2c(util.vecToGrid(tempPoint));
        ctx.arc(point2d.x, point2d.y, 1, 0, Math.PI * 2)
        ctx.stroke()
    });

    ctx.beginPath();
    const zero = util.g2c(new Vec3(0,0,0));
    ctx.arc(zero.x, zero.y, 1, 0, Math.PI * 2)
    ctx.stroke()

    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
}