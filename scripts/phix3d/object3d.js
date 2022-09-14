import { Triangle } from "./structs.js";
export class Object3D {
    verticies;
    triIndex;
    pos;
    scale;
    eulerRot;
    textureID;
    constructor(verticies, triIndex, pos, scale, eulerRot, textureID) {
        this.verticies = verticies;
        this.triIndex = triIndex;
        this.pos = pos;
        this.scale = scale;
        this.eulerRot = eulerRot;
        this.textureID = textureID;
    }
    getTriangles() {
        for (let i = 0; i < this.triIndex.length / 3; i++) {
            new Triangle(this.verticies[i * 3], this.verticies[i * 3 + 1], this.verticies[i * 3 + 2], this.textureID);
        }
    }
}
