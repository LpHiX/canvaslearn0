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
    getTriangles(){
        const objectMatrix = Matrix33.RotYXZScale(this.scale, this.eulerRot);
        for(let i = 0; i < this.triIndex.length / 3; i++){
            new Triangle(
                this.verticies[i * 3].transform(objectMatrix),
                this.verticies[i * 3 + 1].transform(objectMatrix),
                this.verticies[i * 3 + 2].transform(objectMatrix),
                this.texture
            );
        }
    }
}