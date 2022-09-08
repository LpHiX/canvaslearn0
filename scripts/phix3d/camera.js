import { Matrix33, Vec3 } from "./structs.js";
export class FrustPlane {
    normal;
    distance;
    constructor(normal, distance) {
        this.normal = normal;
        this.distance = distance;
    }
}
export class Camera {
    pos;
    eulerRot;
    sizeX;
    sizeY;
    near;
    planes;
    constructor(pos, eulerRot, sizeX, sizeY, near) {
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.near = near;
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
        ];
    }
}
export class Viewport {
    canvas;
    camera;
    ctx;
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.ctx = canvas.getContext("2d");
    }
    drawWorld(world) {
        world.objects.forEach(object => {
            const objectToWorldMatrix = Matrix33.RotYXZScale(object.scale, object.eulerRot);
            const worldToCamera = Matrix33.rotZ(this.camera.eulerRot.z * -1).multiply(Matrix33.rotX(this.camera.eulerRot.x * -1).multiply(Matrix33.rotY(this.camera.eulerRot.y * -1)));
        });
    }
}
