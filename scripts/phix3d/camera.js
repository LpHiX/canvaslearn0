import { Matrix33, Vec3 } from "./structs.js";
import { Rasterizer } from "./rasterizer.js";
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
    texMan;
    ctx;
    rasterizer;
    constructor(canvas, camera, texMan) {
        this.canvas = canvas;
        this.camera = camera;
        this.texMan = texMan;
        this.ctx = canvas.getContext("2d");
        this.rasterizer = new Rasterizer(canvas, texMan);
    }
    drawWorld(world) {
        var viewTriBuffer = [];
        const worldToViewMat = (Matrix33.rotZ(this.camera.eulerRot.z * -1).multiply(Matrix33.rotX(this.camera.eulerRot.x * -1).multiply(Matrix33.rotY(this.camera.eulerRot.y * -1))));
        world.objects.forEach(object => {
            const triangles = object.getObjectTriangles();
            triangles.forEach(triangle => {
                viewTriBuffer.push(worldToViewMat.transformTri(triangle));
            });
        });
        var clippedTriBuffer = [];
        viewTriBuffer.forEach(triangle => {
            clippedTriBuffer.push(triangle);
        });
        var screenTriBuffer = [];
        clippedTriBuffer.forEach(triangle => {
            screenTriBuffer.push(triangle);
        });
        screenTriBuffer.sort((a, b) => b.averageZ - a.averageZ);
        this.rasterizer.drawAllTriangles(screenTriBuffer);
    }
}
