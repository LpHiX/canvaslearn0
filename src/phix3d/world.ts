import { Object3D } from "./object3d.js";
import { Vec3, Vertex } from "./structs.js";

export class World{
    constructor(
        public objects: Object3D[]
    ){}
}