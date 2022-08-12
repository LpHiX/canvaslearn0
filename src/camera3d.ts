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
    add(other: Vec3): Vec3{
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    mul(scalar:number):Vec3{
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    static lerp(alpha:number, a:Vec3, b:Vec3){
        return a.add(b.add(a.mul(-1)).mul(alpha));
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
        public size:number,
        public camera:Camera
    ){
        this.canvasMin = Math.min(canvas.width, canvas.height);
    }
    c2g(coord:Vec2): Vec2{
        return new Vec3(coord.x / canvas.width * 2 - 1,1 - coord.y / canvas.height * 2, 0).mul(this.size);
    }
    g2c(coord:Vec2):Vec2{
        return new Vec3(canvas.width / 2 + coord.x / this.size * canvas.width / 2, canvas.height / 2 - coord.y / this.size * canvas.height / 2, 0)
    }
    vecToGrid(coord: Vec3):Vec2 | null{
        if(coord.z > 0){
            return new Vec2(coord.x / (coord.z), coord.y / (coord.z));
        } else {
            return null;
        }
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
    vecToCanvas(coord:Vec3):Vec2 | null{
        const tempPoint = this.vecToGrid(util.rotX(util.rotY(coord.add(this.camera.pos.mul(-1)), cam.angleY), cam.angleX))
        if(tempPoint !== null){
            return this.g2c(tempPoint);
        } else {
            return null;
        }
    }
}
abstract class object3d{
    constructor(
        public verticies: Vec3[],
        public triangles: number[],
        public pos: Vec3,
        public fillStyle: string
    ){}
    draw(): void{
        ctx.fillStyle = this.fillStyle;
    
        for(var i = 0; i < this.triangles.length / 3; i++){
            const corner0 = util.vecToCanvas(this.verticies[this.triangles[i* 3]].add(this.pos));
            const corner1 = util.vecToCanvas(this.verticies[this.triangles[i* 3 + 1]].add(this.pos));
            const corner2 = util.vecToCanvas(this.verticies[this.triangles[i* 3 + 2]].add(this.pos));
            if(corner0 !== null && corner1 !== null && corner2 !== null){
                ctx.beginPath();
                ctx.moveTo(corner0.x, corner0.y);
                ctx.lineTo(corner1.x, corner1.y);
                ctx.lineTo(corner2.x, corner2.y);
                ctx.closePath()
                ctx.stroke();
                ctx.fill();
            }
        }
    }
    rotateY(angle: number): void {
        for(var i = 0; i < this.verticies.length; i++){
            this.verticies[i] = util.rotY(this.verticies[i], angle);
        }
    }
}
class Cube extends object3d{
    constructor(
        public scale: Vec3,
        public pos: Vec3,
        public fillStyle: string
    ){
        super(
            [ //Verticies
                new Vec3(-0.5 * scale.x, -0.5 * scale.y, -0.5*scale.z),
                new Vec3( 0.5 * scale.x, -0.5 * scale.y, -0.5*scale.z),
                new Vec3(-0.5 * scale.x,  0.5 * scale.y, -0.5*scale.z),
                new Vec3( 0.5 * scale.x,  0.5 * scale.y, -0.5*scale.z),
                new Vec3(-0.5 * scale.x, -0.5 * scale.y,  0.5*scale.z),
                new Vec3( 0.5 * scale.x, -0.5 * scale.y,  0.5*scale.z),
                new Vec3(-0.5 * scale.x,  0.5 * scale.y,  0.5*scale.z),
                new Vec3( 0.5 * scale.x,  0.5 * scale.y,  0.5*scale.z)
            ], [ //Triangles
                0,1,3,
                0,2,3,
                4,5,7,
                4,6,7,
                0,4,6,
                0,2,6,
                1,3,7,
                1,5,7,
                0,1,5,
                0,4,5,
                2,3,7,
                2,6,7
            ], pos, fillStyle);
    }
}
class Plane extends object3d{
    constructor(
        public size: number,
        public scale: Vec3,
        public pos: Vec3,
        public fillStyle: string
    ){
        super(
            [], [], pos, fillStyle
        );
        for(var z = 0; z <= size; z++){
            for(var x = 0; x <= size; x++){
                const newPoint = Vec3.lerp(z / size, 
                Vec3.lerp(x / size, new Vec3(-scale.x / 2, 0, -scale.z / 2), new Vec3(scale.x / 2, 0, -scale.z / 2)), 
                Vec3.lerp(x / size, new Vec3(-scale.x / 2, 0, scale.z / 2), new Vec3(scale.x / 2, 0, scale.z / 2)));
                this.verticies.push(newPoint);
            }
        }
        for(var y = 0; y < size; y++) {
            for(var x = 0; x < size; x++) {
                this.triangles.push(x + y * (size + 1));
                this.triangles.push(x + y * (size + 1) + 1);
                this.triangles.push(x + (y + 1) * (size + 1) + 1);
                this.triangles.push(x + y * (size + 1));
                this.triangles.push(x + (y + 1) * (size + 1));
                this.triangles.push(x + (y + 1) * (size + 1) + 1);
            }
        }
    }
}


const cam = new Camera(new Vec3(0,0,0), 0, 0);
const util = new Util(1, cam);

let down = false;
let startX = 0;
let startY = 0;
let premoveY = 0;
let premoveX = 0;
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;

function setup(){
    ctx.font = "10px Arial";
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
    canvas.addEventListener("touchstart", function(event) {
        down = true;
        premoveX = cam.angleX;
        premoveY = cam.angleY;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    canvas.addEventListener("touchend", () => {
        down = false;
        premoveX = cam.angleX;
        premoveY = cam.angleY;
    });
    canvas.addEventListener("mousemove", function(event) {
        if(down){
            cam.angleY = premoveY + (event.clientX - startX) / 100;
            cam.angleX = premoveX - (event.clientY - startY) / 100;
        }
    });
    canvas.addEventListener("touchmove", function(event) {
        if(down){
            cam.angleY = premoveY + (event.touches[0].clientX - startX) / 100;
            cam.angleX = premoveX - (event.touches[0].clientY - startY) / 100;
        }
    });
    document.addEventListener("keydown", function(event) {
        switch(event.key){
            case "w":
                wPressed = true;
                break;
            case "a":
                aPressed = true;
                break;
            case "s":
                sPressed = true;
                break;
            case "d":
                dPressed = true;
                break;
            default:
                break;
        }
        //event.preventDefault();
    });
    document.addEventListener("keyup", function(event) {
        switch(event.key){
            case "w":
                wPressed = false;
                break;
            case "a":
                aPressed = false;
                break;
            case "s":
                sPressed = false;
                break;
            case "d":
                dPressed = false;
                break;
            default:
                break;
        }
        //event.preventDefault();
    });
}
const cube = new Cube(new Vec3(1, 1, 1), new Vec3( 2, 3, 5), "rgb(0, 255, 255)");
const cube2 = new Cube(new Vec3(2, 3, 2), new Vec3( -3, 1, 4), "rgb(0, 255, 0)");
const plane = new Plane(10, new Vec3(10, 1, 10), new Vec3(0, -1, 3), "rgb(255, 100, 200");
function frameUpdate(timestamp:number){
    ctx.fillStyle = "rgb(30, 40, 50)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(wPressed){
        cam.pos = cam.pos.add(util.rotY(new Vec3(0, 0, 0.1), -cam.angleY));
    }
    if(aPressed){
        cam.pos = cam.pos.add(util.rotY(new Vec3(-0.1, 0, 0), -cam.angleY));
    }
    if(sPressed){
        cam.pos = cam.pos.add(util.rotY(new Vec3(0, 0, -0.1), -cam.angleY));
    }
    if(dPressed){
        cam.pos = cam.pos.add(util.rotY(new Vec3(0.1, 0, 0), -cam.angleY));
    }
    cube.draw();
    cube2.draw();
    cube2.rotateY(0.1);
    plane.draw();

    ctx.beginPath();
    const zero = util.g2c(new Vec3(0,0,0));
    ctx.arc(zero.x, zero.y, 1, 0, Math.PI * 2)
    ctx.stroke()

    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
}