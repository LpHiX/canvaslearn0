import { Vec3, Vertex } from "./structs.js";

export class Object3D{
    constructor(
        public pos: Vec3,
        public eulerRot: Vec3,
        public scale: Vec3,
        public verticies: Vertex[],
        public triIndex: number[],
    ){}
}
export class World{
    constructor(
        public objects: Object3D[]
    ){}
}