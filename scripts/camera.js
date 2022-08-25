import { rotZXY } from "./utils.js";
import { Side, Triangle, Vec3 } from "./structs.js";
export class Camera {
    constructor(pos, eulerRot, cameraModel, near, far, xScale, yScale) {
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.cameraModel = cameraModel;
        this.near = near;
        this.far = far;
        this.xScale = xScale;
        this.yScale = yScale;
        const horzAngle = Math.atan2(1, xScale);
        const vertAngle = Math.atan2(1, yScale);
        const normSX = Math.sin(horzAngle);
        const normSZ = Math.cos(horzAngle);
        const normVY = Math.sin(vertAngle);
        const normVZ = Math.cos(vertAngle);
        this.sides = [
            new Side(normSX, 0, normSZ, 0),
            new Side(-normSX, 0, normSZ, 0),
            new Side(0, normVY, normVZ, 0),
            new Side(0, -normVY, normVZ, 0),
            new Side(0, 0, 1, near),
        ];
    }
}
export class Viewport {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.canvasMin = Math.min(canvas.width, canvas.height);
        this.ctx = this.canvas.getContext("2d");
    }
    g2c(coord) {
        return new Vec3(this.canvas.width / 2 + coord.x / this.camera.xScale * this.canvasMin / 2, this.canvas.height / 2 - coord.y / this.camera.yScale * this.canvasMin / 2, coord.z);
    }
    vecToCanvas(vertex, divide) {
        const vertRotated = rotZXY(this.camera.eulerRot.mul(-1), vertex.add(this.camera.pos.mul(-1)));
        if (vertRotated.z > 0) {
            if (divide) {
                return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), (vertRotated.z /*- this.camera.near) / (this.camera.far - this.camera.near*/)));
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
            const vert0 = buffer[i].vert0;
            const vert1 = buffer[i].vert1;
            const vert2 = buffer[i].vert2;
            var vert0distances = [];
            var vert1distances = [];
            var vert2distances = [];
            for (var i = 0; i < 5; i++) {
                vert0distances.push(this.camera.sides[i].signedDistance(vert0));
                vert1distances.push(this.camera.sides[i].signedDistance(vert1));
                vert2distances.push(this.camera.sides[i].signedDistance(vert2));
            }
            if (vert0distances[0] > 0) {
                if (vert1distances[0] > 0) {
                    if (vert0distances[0] > 0) {
                    }
                    else {
                        // 0, 0, 1
                    }
                }
                else {
                    if (vert2distances[0] > 0) {
                    }
                    else {
                        // 0, 1, 1
                    }
                }
            }
            const corner0 = this.vecToCanvas(buffer[i].vert0, true);
            const corner1 = this.vecToCanvas(buffer[i].vert1, true);
            const corner2 = this.vecToCanvas(buffer[i].vert2, true);
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer[i] = new Triangle(corner0, corner1, corner2, buffer[i].wireframe, buffer[i].fillStyle);
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
