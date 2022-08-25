import { rotYXZ } from "./utils.js";
import { Triangle } from "./structs.js";
export class Object3d {
    constructor(verticies, triangles, pos, eulerRot, wireframe, fillStyle) {
        this.verticies = verticies;
        this.triangles = triangles;
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
    }
    getTriangles(viewport) {
        var buffer = [];
        for (var i = 0; i < this.triangles.length / 3; i++) {
            const corner0 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3]]).add(this.pos), true, true);
            const corner1 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 1]]).add(this.pos), true, true);
            const corner2 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 2]]).add(this.pos), true, true);
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer.push(new Triangle(corner0, corner1, corner2, this.wireframe, this.fillStyle));
            }
        }
        return buffer;
    }
    getTriangles2() {
        var buffer = [];
        for (var i = 0; i < this.triangles.length / 3; i++) {
            const corner0 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3]]).add(this.pos);
            const corner1 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 1]]).add(this.pos);
            const corner2 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 2]]).add(this.pos);
            buffer.push(new Triangle(corner0, corner1, corner2, this.wireframe, this.fillStyle));
        }
        return buffer;
    }
    projectVerticies(fromView, toView, divide, clip) {
        var buffer = [];
        for (var i = 0; i < this.triangles.length / 3; i++) {
            const corner0 = fromView.canonVertex(this.verticies[this.triangles[i * 3]], this.eulerRot, this.pos, toView, divide, clip);
            const corner1 = fromView.canonVertex(this.verticies[this.triangles[i * 3 + 1]], this.eulerRot, this.pos, toView, divide, clip);
            const corner2 = fromView.canonVertex(this.verticies[this.triangles[i * 3 + 2]], this.eulerRot, this.pos, toView, divide, clip);
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer.push(new Triangle(corner0, corner1, corner2, this.wireframe, this.fillStyle));
            }
        }
        return buffer;
    }
}
export class World {
    constructor() {
        this.objects = [];
    }
    loadBuffer(viewport) {
        var buffer = [];
        this.objects.forEach(object => {
            if (object !== viewport.camera.cameraModel) {
                buffer = buffer.concat(object.getTriangles(viewport));
            }
        });
        return buffer;
    }
    load3dBuffer(viewport) {
        var buffer = [];
        this.objects.forEach(object => {
            if (object !== viewport.camera.cameraModel) {
                buffer = buffer.concat(object.getTriangles2());
            }
        });
        return buffer;
    }
    loadCanonBuffer(fromView, toView, divide, clip) {
        var buffer = [];
        this.objects.forEach(object => {
            buffer = buffer.concat(object.projectVerticies(fromView, toView, divide, clip));
        });
        return buffer;
    }
}
