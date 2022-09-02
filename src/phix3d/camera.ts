import { Vec3 } from "./structs.js";

export class Camera{
    constructor(
        public pos: Vec3,
        public eulerRot: Vec3,
        public frustumSize: Vec3,
        public near: number
    ){}
}
export class Viewport{
    constructor(
        public canvas: HTMLCanvasElement,
        public camera: Camera,
    ){}
}