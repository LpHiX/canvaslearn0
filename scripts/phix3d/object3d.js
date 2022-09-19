import { Vec3, Vertex, Matrix33, Triangle } from "./structs.js";
export class Object3D {
    verticies;
    triIndex;
    pos;
    scale;
    eulerRot;
    texture;
    constructor(verticies, triIndex, pos, scale, eulerRot, texture) {
        this.verticies = verticies;
        this.triIndex = triIndex;
        this.pos = pos;
        this.scale = scale;
        this.eulerRot = eulerRot;
        this.texture = texture;
    }
    getObjectTriangles() {
        var objectTriangles = [];
        const objectToWorldMatrix = Matrix33.RotYXZScale(this.scale, this.eulerRot);
        for (let i = 0; i < this.triIndex.length / 3; i++) {
            objectTriangles.push(objectToWorldMatrix.transformTri(new Triangle(this.verticies[this.triIndex[i * 3]], this.verticies[this.triIndex[i * 3 + 1]], this.verticies[this.triIndex[i * 3 + 2]], this.texture)).addPos(this.pos));
        }
        return objectTriangles;
    }
}
export class Cube extends Object3D {
    pos;
    texture;
    constructor(pos, texture) {
        super([
            new Vertex(-0.5, 0.5, -0.5, 0.25, 0.25, 1),
            new Vertex(0.5, 0.5, -0.5, 0.5, 0.25, 1),
            new Vertex(-0.5, -0.5, -0.5, 0.25, 0.5, 1),
            new Vertex(0.5, -0.5, -0.5, 0.5, 0.5, 1),
            new Vertex(-0.5, 0.5, 0.5, 0.75, 0.25, 1),
            new Vertex(0.5, 0.5, 0.5, 1, 0.25, 1),
            new Vertex(-0.5, -0.5, 0.5, 0.75, 0.5, 1),
            new Vertex(0.5, -0.5, 0.5, 1, 0.5, 1),
            new Vertex(-0.5, 0.5, 0.5, 0, 0.25, 1),
            new Vertex(-0.5, 0.5, -0.5, 0.25, 0.25, 1),
            new Vertex(-0.5, -0.5, 0.5, 0, 0.5, 1),
            new Vertex(-0.5, -0.5, -0.5, 0.25, 0.5, 1),
            new Vertex(0.5, 0.5, -0.5, 0.25, 0.25, 1),
            new Vertex(0.5, 0.5, 0.5, 0.5, 0.25, 1),
            new Vertex(0.5, -0.5, -0.5, 0.25, 0.5, 1),
            new Vertex(0.5, -0.5, 0.5, 0.5, 0.5, 1),
            new Vertex(-0.5, -0.5, 0.5, 0.25, 0.5, 1),
            new Vertex(0.5, -0.5, 0.5, 0.5, 0.5, 1),
            new Vertex(-0.5, -0.5, -0.5, 0.25, 0.75, 1),
            new Vertex(0.5, -0.5, -0.5, 0.5, 0.75, 1),
            new Vertex(-0.5, 0.5, -0.5, 0.25, 0.0, 1),
            new Vertex(0.5, 0.5, -0.5, 0.5, 0.0, 1),
            new Vertex(-0.5, 0.5, 0.5, 0.25, 0.25, 1),
            new Vertex(0.5, 0.5, 0.5, 0.5, 0.25, 1)
        ], [
            0, 1, 3, 0, 2, 3,
            4, 5, 7, 4, 6, 7,
            8, 9, 11, 8, 10, 11,
            12, 13, 15, 12, 14, 15,
            16, 17, 19, 16, 18, 19,
            20, 21, 23, 20, 22, 23
        ], pos, new Vec3(1, 1, 1), new Vec3(0, 0, 0), texture);
        this.pos = pos;
        this.texture = texture;
    }
}
