import { Vec3, Vertex, Matrix33, Triangle } from "./structs.js";

export class Object3D{
    constructor(
        public verticies: Vertex[],
        public triIndex: number[],
        public pos: Vec3,
        public scale: Vec3,
        public eulerRot: Vec3,
        public texture: Uint8ClampedArray
    ){}
    getObjectTriangles(){
        var objectTriangles = [];
        for(let i = 0; i < this.triIndex.length / 3; i++){
            objectTriangles.push(new Triangle(
                this.verticies[i * 3],
                this.verticies[i * 3 + 1],
                this.verticies[i * 3 + 2],
                this.texture
            ));
        }
    }
}