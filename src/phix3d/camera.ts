import { World } from "./scene3d";
import { Matrix33, Vec3 } from "./structs.js";

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
    constructor(
        public canvas: HTMLCanvasElement,
        public camera: Camera,
    ){
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    }
    drawWorld(world: World){
        world.objects.forEach(object => {
            const objectToWorldMatrix = Matrix33.RotYXZScale(object.scale, object.eulerRot);
            const worldToCamera = Matrix33.rotZ(this.camera.eulerRot.z * -1).multiply(Matrix33.rotX(this.camera.eulerRot.x * -1).multiply(Matrix33.rotY(this.camera.eulerRot.y * -1)))
        });
    }
}