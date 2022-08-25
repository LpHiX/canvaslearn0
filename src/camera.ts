import { World, Object3d} from "./class3d";
import {rotX, rotY, rotZ, rotYXZ, rotZXY} from "./utils.js";
import {Vec2, Vec3} from "./structs.js";

export class Camera{
    constructor(
        public pos:Vec3,
        public eulerRot: Vec3,
        public cameraModel: Object3d | null,
        public near: number,
        public far: number
    ){}
}
export class Viewport{
    public canvasMin: number;
    public ctx: CanvasRenderingContext2D;
    constructor(
        public canvas: HTMLCanvasElement,
        public camera: Camera,
        public size: number // TEMPORARY
    ){
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }
    g2c(coord:Vec3):Vec3{
        return new Vec3(
            this.canvas.width / 2 + coord.x / this.size * this.canvasMin / 2,
            this.canvas.height / 2 -coord.y / this.size * this.canvasMin / 2, coord.z);
    }
    vecToCanvas(vertex: Vec3, safe: boolean, divide: boolean): Vec3| null{
        const vertRotated = rotZ(-this.camera.eulerRot.z, rotX(-this.camera.eulerRot.x, rotY(-this.camera.eulerRot.y, vertex.add(this.camera.pos.mul(-1)))));
        if(vertRotated.z > 0 || !safe){
            if(divide){
                return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), vertRotated.z));
            } else{
                return this.g2c(new Vec3(vertRotated.x, vertRotated.y, vertRotated.z)); 
            }
        } else {
            return null;
        }
    }
    drawWorld(world: World, otherViewport: Viewport | null):void{
        var buffer = world.loadBuffer(this);
        if(otherViewport !== null){
            buffer = buffer.concat(world.loadCanonBuffer(otherViewport, this, true, false));
        }
        buffer = buffer.sort((a,b) => (a.avgZ < b.avgZ) ? 1 : -1);
        buffer.forEach(triangle => {
            this.ctx.fillStyle = triangle.fillStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(triangle.vert0.x, triangle.vert0.y);
            this.ctx.lineTo(triangle.vert1.x, triangle.vert1.y);
            this.ctx.lineTo(triangle.vert2.x, triangle.vert2.y);
            this.ctx.closePath()
            if(!triangle.wireframe){
                this.ctx.fill();
                this.ctx.strokeStyle = "rgb(0,0,0)";
            } else{
                this.ctx.strokeStyle = triangle.fillStyle;
            }
            this.ctx.stroke();

        });
    }
    /*drawWorld2(world: World):void{
        var buffer = world.load3dBuffer(this);
        for(var i = 0; i < buffer.length; i++){
            buffer[i] = this.vecToCanvas()
        })
        buffer = buffer.sort((a,b) => (a.avgZ < b.avgZ) ? 1 : -1);
        buffer.forEach(triangle => {
            this.ctx.fillStyle = triangle.fillStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(triangle.vert0.x, triangle.vert0.y);
            this.ctx.lineTo(triangle.vert1.x, triangle.vert1.y);
            this.ctx.lineTo(triangle.vert2.x, triangle.vert2.y);
            this.ctx.closePath()
            if(!triangle.wireframe){
                this.ctx.fill();
                this.ctx.strokeStyle = "rgb(0,0,0)";
            } else{
                this.ctx.strokeStyle = triangle.fillStyle;
            }
            this.ctx.stroke();

        });
    }*/
    drawCanon(world: World):void{
        var buffer = (world.loadCanonBuffer(this, this, false, true));
        buffer = buffer.sort((a,b) => (a.avgZ < b.avgZ) ? 1 : -1);
        buffer.forEach(triangle => {
            this.ctx.fillStyle = triangle.fillStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(triangle.vert0.x, triangle.vert0.y);
            this.ctx.lineTo(triangle.vert1.x, triangle.vert1.y);
            this.ctx.lineTo(triangle.vert2.x, triangle.vert2.y);
            this.ctx.closePath()
            if(!triangle.wireframe){
                this.ctx.fill();
                this.ctx.strokeStyle = "rgb(0,0,0)";
            } else{
                this.ctx.strokeStyle = triangle.fillStyle;
            }
            this.ctx.stroke();

        });
    }
    canonVertex(coord:Vec3, eulerAngle: Vec3, objPos: Vec3, toView:Viewport, divide: boolean, clip: boolean):Vec3 | null{
        coord = rotYXZ(eulerAngle, coord);
        coord = coord.add(objPos);
        coord = coord.add(this.camera.pos.mul(-1));
        coord = rotZXY(this.camera.eulerRot.mul(-1), coord);
        coord = new Vec3(coord.x / coord.z, coord.y / coord.z, (coord.z - this.camera.near) / (this.camera.far - this.camera.near))
        if(coord.z > 0){
            if(clip){
                if(coord.x < 1 && coord.x > -1 && coord.y < 1 && coord.y > -1 && coord.z > 0 && coord.z < 1){
                    coord = rotYXZ(this.camera.eulerRot, coord);
                    coord = coord.add(this.camera.pos);
                    return toView.vecToCanvas(coord, false, divide);
                } else{
                    return null;
                }
            } else{
                coord = rotYXZ(this.camera.eulerRot, coord);
                coord = coord.add(this.camera.pos);
                return toView.vecToCanvas(coord, clip, divide);
            }
        } else{
            return null;
        }
    }
}