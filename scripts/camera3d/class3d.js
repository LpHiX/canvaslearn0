import { rotYXZ } from "./utils.js";
import { Triangle } from "./structs.js";
export class Object3d {
    verticies;
    triangles;
    pos;
    eulerRot;
    wireframe;
    fillStyle;
    constructor(verticies, triangles, pos, eulerRot, wireframe, fillStyle) {
        this.verticies = verticies;
        this.triangles = triangles;
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
    }
    getTriangles() {
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
    objects;
    constructor() {
        this.objects = [];
    }
    load3dBuffer(excludedObjects) {
        var buffer = [];
        this.objects.forEach(object => {
            if (!excludedObjects.includes(object)) {
                buffer = buffer.concat(object.getTriangles());
            }
        });
        return buffer;
    }
}
