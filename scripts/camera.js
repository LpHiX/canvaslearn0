import { rotZXY } from "./utils.js";
import { Triangle2, Vec3 } from "./structs.js";
export class Camera {
    constructor(pos, eulerRot, cameraModel, near, far) {
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.cameraModel = cameraModel;
        this.near = near;
        this.far = far;
    }
}
export class Viewport {
    constructor(canvas, camera, size // TEMPORARY
    ) {
        this.canvas = canvas;
        this.camera = camera;
        this.size = size;
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.ctx = this.canvas.getContext("2d");
    }
    g2c(coord) {
        return new Vec3(this.canvas.width / 2 + coord.x / this.size * this.canvasMin / 2, this.canvas.height / 2 - coord.y / this.size * this.canvasMin / 2, coord.z);
    }
    vecToCanvas(vertex, safe, divide) {
        const vertRotated = rotZXY(this.camera.eulerRot.mul(-1), vertex.add(this.camera.pos.mul(-1)));
        if (vertRotated.z > 0 || !safe) {
            if (divide) {
                return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), (vertRotated.z - this.camera.near) / (this.camera.far - this.camera.near)));
            }
            else {
                return this.g2c(new Vec3(vertRotated.x, vertRotated.y, vertRotated.z));
            }
        }
        else {
            return null;
        }
    }
    drawWorld(world, excludedObjects) {
        var buffer = world.load3dBuffer(excludedObjects);
        for (var i = 0; i < buffer.length; i++) {
            const corner0 = this.vecToCanvas(buffer[i].vert0, true, true);
            const corner1 = this.vecToCanvas(buffer[i].vert1, true, true);
            const corner2 = this.vecToCanvas(buffer[i].vert2, true, true);
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer[i] = new Triangle2(corner0, corner1, corner2, buffer[i].wireframe, buffer[i].fillStyle);
            }
        }
        buffer = buffer.sort((a, b) => (a.avgZ < b.avgZ) ? 1 : -1);
        buffer.forEach(triangle => {
            this.ctx.fillStyle = triangle.fillStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(triangle.vert0.x, triangle.vert0.y);
            this.ctx.lineTo(triangle.vert1.x, triangle.vert1.y);
            this.ctx.lineTo(triangle.vert2.x, triangle.vert2.y);
            this.ctx.closePath();
            if (!triangle.wireframe) {
                this.ctx.fill();
                this.ctx.strokeStyle = "rgb(0,0,0)";
            }
            else {
                this.ctx.strokeStyle = triangle.fillStyle;
            }
            this.ctx.stroke();
        });
    }
}
