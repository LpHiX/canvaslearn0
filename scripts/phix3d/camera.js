export class Camera {
    constructor(pos, eulerRot, frustumSize, near) {
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.frustumSize = frustumSize;
        this.near = near;
    }
}
export class Viewport {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
    }
}
