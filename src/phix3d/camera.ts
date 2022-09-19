import { World } from "./world.js";
import { Matrix33, Triangle, Vec3, Vertex } from "./structs.js";
import { Rasterizer } from "./rasterizer.js";
import { TextureManager } from "./textureloader.js";

export class FrustPlane{
    constructor(
        public normal: Vec3,
        public distance: number
    ){}
}

export class Camera{
    planes: FrustPlane[];
    constructor(
        public pos: Vec3,
        public eulerRot: Vec3,
        public sizeX: number,
        public sizeY: number,
        public near: number
    ){
        const angleX = Math.atan2(sizeX, 1);
        const angleY = Math.atan2(sizeY, 1);
        const normHX = Math.cos(angleX);
        const normHZ = Math.sin(angleX);
        const normVY = Math.cos(angleY);
        const normVZ = Math.sin(angleY);
        this.planes = [
            new FrustPlane(new Vec3(normHX, 0, normHZ), 0),
            new FrustPlane(new Vec3(-normHX, 0, normHZ), 0),
            new FrustPlane(new Vec3(0, normVY, normVZ), 0),
            new FrustPlane(new Vec3(0, -normVY, normVZ), 0),
            new FrustPlane(new Vec3(0, 0, 1), near)
        ]
    }
}
export class Viewport{
    ctx: CanvasRenderingContext2D;
    rasterizer: Rasterizer;
    constructor(
        public canvas: HTMLCanvasElement,
        public camera: Camera,
        public texMan: TextureManager
    ){
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.rasterizer = new Rasterizer(canvas, texMan);
    }
    drawWorld(world: World){
        var viewTriBuffer: Triangle[] = [];
        const worldToViewMat = (
            Matrix33.rotZ(this.camera.eulerRot.z * -1).multiply(
                Matrix33.rotX(this.camera.eulerRot.x * -1).multiply(
                    Matrix33.rotY(this.camera.eulerRot.y * -1))));
        world.objects.forEach(object => {
            const triangles = object.getObjectTriangles();
            triangles.forEach(triangle => {                
                viewTriBuffer.push(worldToViewMat.transformTri(triangle))
            })
        });

        var clippedTriBuffer: Triangle[] = [];
        viewTriBuffer.forEach(triangle => {
            clippedTriBuffer.push(triangle)
        });

        var screenTriBuffer: Triangle[] = [];
        clippedTriBuffer.forEach(triangle => {
            screenTriBuffer.push(triangle);
        })
        screenTriBuffer.sort((a, b) => b.averageZ - a.averageZ);

        this.rasterizer.drawAllTriangles(screenTriBuffer)

    }
}