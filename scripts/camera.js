import { Vec3 } from "./structs.js";
export class Camera {
    constructor(pos, angleX, angleY, angleZ) {
        this.pos = pos;
        this.angleX = angleX;
        this.angleY = angleY;
        this.angleZ = angleZ;
    }
}
export class Triangle {
    constructor(vert0, vert1, vert2, fillStyle) {
        this.vert0 = vert0;
        this.vert1 = vert1;
        this.vert2 = vert2;
        this.fillStyle = fillStyle;
        this.avgZ = (vert0.z + vert1.z + vert2.z) / 3;
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
    vecToCanvas(vertex) {
        const vertRotated = rotZ(this.camera.angleZ, rotX(this.camera.angleX, rotY(this.camera.angleY, vertex.add(this.camera.pos.mul(-1)))));
        if (vertRotated.z > 0) {
            return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), vertRotated.z));
        }
        else {
            return null;
        }
    }
    drawBuffer(buffer) {
        buffer = buffer.sort((a, b) => (a.avgZ < b.avgZ) ? 1 : -1);
        buffer.forEach(triangle => {
            this.ctx.fillStyle = triangle.fillStyle;
            this.ctx.beginPath();
            this.ctx.moveTo(triangle.vert0.x, triangle.vert0.y);
            this.ctx.lineTo(triangle.vert1.x, triangle.vert1.y);
            this.ctx.lineTo(triangle.vert2.x, triangle.vert2.y);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.fill();
        });
    }
}
export function rotZ(angle, coord) {
    return new Vec3(coord.x * Math.cos(angle) - coord.y * Math.sin(angle), coord.x * Math.sin(angle) + coord.y * Math.cos(angle), coord.z);
}
export function rotX(angle, coord) {
    return new Vec3(coord.x, coord.y * Math.cos(angle) - coord.z * Math.sin(angle), coord.y * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotY(angle, coord) {
    return new Vec3(coord.x * Math.cos(angle) - coord.z * Math.sin(angle), coord.y, coord.x * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotYXZ(angles, coord) {
    return rotZ(angles.z, rotX(angles.x, rotY(angles.y, coord)));
}
