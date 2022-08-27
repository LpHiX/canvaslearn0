import { World, Object3d} from "./class3d";
import {rotX, rotY, rotZ, rotYXZ, rotZXY, lerpVec} from "./utils.js";
import {Side, Triangle, Vec3} from "./structs.js";


export class Camera{
    public sides: Side[];
    constructor(
        public pos:Vec3,
        public eulerRot: Vec3,
        public cameraModel: Object3d | null,
        public near: number,
        public far: number,
        public xScale: number,
        public yScale: number
    ){
        const horzAngle = Math.atan2(1, xScale);
        const vertAngle = Math.atan2(1, yScale);
        const normSX = Math.sin(horzAngle);
        const normSZ = Math.cos(horzAngle);
        const normVY = Math.sin(vertAngle);
        const normVZ = Math.cos(vertAngle);
        this.sides = [ // Left, right, bottom, top, near, far
            new Side( normSX, 0, normSZ, 0),
            new Side(-normSX, 0, normSZ, 0),
            new Side(0, normVY, normVZ, 0),
            new Side(0, -normVY, normVZ, 0),
            new Side(0, 0, 1, near),
        ];
    }
}
export class Viewport{
    public canvasMin: number;
    public ctx: CanvasRenderingContext2D;
    constructor(
        public canvas: HTMLCanvasElement,
        public camera: Camera
    ){
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }
    g2c(coord:Vec3):Vec3{
        return new Vec3(
            this.canvas.width / 2 + coord.x / this.camera.xScale * this.canvasMin / 2,
            this.canvas.height / 2 -coord.y / this.camera.yScale * this.canvasMin / 2, coord.z);
    }
    vecToCanvas(vertex: Vec3, divide: boolean): Vec3| null{
        const vertRotated = rotZXY(this.camera.eulerRot.mul(-1), vertex.add(this.camera.pos.mul(-1)));
        if(vertRotated.z > 0){
            if(divide){
                return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), (vertRotated.z /*- this.camera.near) / (this.camera.far - this.camera.near*/)));
            } else{
                return this.g2c(new Vec3(vertRotated.x, vertRotated.y, vertRotated.z)); 
            }
        } else {
            return null;
        }
    }
    triangleToCanvas(triangle: Triangle): Triangle{
        return new Triangle(
            this.vecToCanvas(triangle.vert0, true),
            this.vecToCanvas(triangle.vert1, true),
            this.vecToCanvas(triangle.vert2, true),
            triangle.wireframe,
            triangle.fillStyle
        )
    }
    drawWorld(world: World, excludedObjects: Object3d[]):void{
        var buffer = world.load3dBuffer(excludedObjects);
        for(var i = 0; i < buffer.length; i++){
            const verts = [buffer[i].vert0, buffer[i].vert1, buffer[i].vert2]
            var vertDistances: number[][] = []
            for(var i = 0; i < 5; i++){
                var distances = []
                distances.push(this.camera.sides[i].signedDistance(verts[0]))
                distances.push(this.camera.sides[i].signedDistance(verts[1]))
                distances.push(this.camera.sides[i].signedDistance(verts[2]))
                vertDistances.push(distances);
            }
            // LEFT SIDE
            var clipCase = 0;
            for(var i = 0; i < 2; i++){
                clipCase += vertDistances[0][i] > 0 ? 1 : 0;
            }
            switch (clipCase) {
                case 0:
                    break;
                case 1:
                    const indicies = [0, 1, 2].sort((a, b) => vertDistances[0][a] - vertDistances[0][b]);
                    const clippedVert0 = lerpVec(verts[indicies[0]], verts[indicies[1]], - vertDistances[0][indicies[0]] / (vertDistances[0][indicies[1]] - vertDistances[0][indicies[0]]))
                    const clippedVert1 = lerpVec(verts[indicies[0]], verts[indicies[2]], - vertDistances[0][indicies[0]] / (vertDistances[0][indicies[2]] - vertDistances[0][indicies[0]]))                    
                    break;
                case 2:
                    break;
                default:
                    break;
            }
            const corner0 = this.vecToCanvas(buffer[i].vert0, true);
            const corner1 = this.vecToCanvas(buffer[i].vert1, true);
            const corner2 = this.vecToCanvas(buffer[i].vert2, true);
            if(corner0 !== null && corner1 !== null && corner2 !== null){
                buffer[i] = new Triangle(corner0, corner1, corner2, buffer[i].wireframe, buffer[i].fillStyle);
            }
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
}