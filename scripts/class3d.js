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
}
export class World {
    constructor() {
        this.objects = [];
    }
    load3dBuffer(excludedObjects) {
        var buffer = [];
        this.objects.forEach(object => {
            if (!excludedObjects.includes(object)) {
                buffer = buffer.concat(object.getTriangles2());
            }
        });
        return buffer;
    }
}
