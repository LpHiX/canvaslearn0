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
    vecToCanvasSafe(vertex) {
        const vertRotated = rotZXY(this.camera.eulerRot.mul(-1), vertex.add(this.camera.pos.mul(-1)));
        return this.g2c(new Vec3(vertRotated.x / (vertRotated.z), vertRotated.y / (vertRotated.z), (vertRotated.z /*- this.camera.near) / (this.camera.far - this.camera.near*/)));
    }
    triangleToCanvas(triangle) {
        return new Triangle(this.g2c(new Vec3(triangle.vert0.x / triangle.vert0.z, triangle.vert0.y / triangle.vert0.z, triangle.vert0.z)), this.g2c(new Vec3(triangle.vert1.x / triangle.vert1.z, triangle.vert1.y / triangle.vert1.z, triangle.vert1.z)), this.g2c(new Vec3(triangle.vert2.x / triangle.vert2.z, triangle.vert2.y / triangle.vert2.z, triangle.vert2.z)), triangle.wireframe, triangle.fillStyle);
    }
    triangleToCam(triangle) {
        return new Triangle(rotZXY(this.camera.eulerRot.mul(-1), triangle.vert0.add(this.camera.pos.mul(-1))), rotZXY(this.camera.eulerRot.mul(-1), triangle.vert1.add(this.camera.pos.mul(-1))), rotZXY(this.camera.eulerRot.mul(-1), triangle.vert2.add(this.camera.pos.mul(-1))), triangle.wireframe, triangle.fillStyle);
    }
    drawWorld(world, excludedObjects) {
        var bufferWorld = world.load3dBuffer(excludedObjects);
        bufferWorld.push(new Triangle(new Vec3(-2.5, 1, 2), new Vec3(-3.5, 2, 3), new Vec3(-2, 1, 4), false, "rgb(255,255,255)"));
        var buffer3D = [];
        for (let bufferIndex = 0; bufferIndex < bufferWorld.length; bufferIndex++) {
            buffer3D.push(this.triangleToCam(bufferWorld[bufferIndex]));
        }
        var bufferClipped3D = [];
        for (var bufferIndex = 0; bufferIndex < buffer3D.length; bufferIndex++) {
            var workingBuffer = [buffer3D[bufferIndex]];
            for (let side = 0; side < 5; side++) {
                var clippedBuffer = [];
                for (let preTriIndex = 0; preTriIndex < workingBuffer.length; preTriIndex++) {
                    const verts = [workingBuffer[preTriIndex].vert0, workingBuffer[preTriIndex].vert1, workingBuffer[preTriIndex].vert2];
                    var vertDistances = [this.camera.sides[side].signedDistance(verts[0]), this.camera.sides[side].signedDistance(verts[1]), this.camera.sides[side].signedDistance(verts[2])];
                    var clipCase = 0;
                    for (var vertexIndex = 0; vertexIndex < 3; vertexIndex++) {
                        clipCase += vertDistances[vertexIndex] > 0 ? 0 : 1;
                    }
                    switch (clipCase) {
                        case 0:
                            clippedBuffer.push(new Triangle(verts[0], verts[1], verts[2], buffer3D[bufferIndex].wireframe, buffer3D[bufferIndex].fillStyle));
                            break;
                        case 1:
                            var indicies = [0, 1, 2].sort((a, b) => vertDistances[a] - vertDistances[b]);
                            var clippedVert0 = Vec3.lerp(-vertDistances[indicies[0]] / (vertDistances[indicies[1]] - vertDistances[indicies[0]]), verts[indicies[0]], verts[indicies[1]]);
                            var clippedVert1 = Vec3.lerp(-vertDistances[indicies[0]] / (vertDistances[indicies[2]] - vertDistances[indicies[0]]), verts[indicies[0]], verts[indicies[2]]);
                            clippedBuffer.push(new Triangle(clippedVert0, verts[indicies[1]], verts[indicies[2]], buffer3D[bufferIndex].wireframe, buffer3D[bufferIndex].fillStyle));
                            clippedBuffer.push(new Triangle(clippedVert0, clippedVert1, verts[indicies[2]], buffer3D[bufferIndex].wireframe, buffer3D[bufferIndex].fillStyle));
                            break;
                        case 2:
                            var indicies = [0, 1, 2].sort((a, b) => vertDistances[a] - vertDistances[b]);
                            var clippedVert0 = Vec3.lerp(-vertDistances[indicies[0]] / (vertDistances[indicies[2]] - vertDistances[indicies[0]]), verts[indicies[0]], verts[indicies[2]]);
                            var clippedVert1 = Vec3.lerp(-vertDistances[indicies[1]] / (vertDistances[indicies[2]] - vertDistances[indicies[1]]), verts[indicies[1]], verts[indicies[2]]);
                            clippedBuffer.push(new Triangle(clippedVert0, clippedVert1, verts[indicies[2]], buffer3D[bufferIndex].wireframe, buffer3D[bufferIndex].fillStyle));
                            break;
                        default:
                            break;
                    }
                }
                //console.log(clippedBuffer);
                workingBuffer = clippedBuffer;
            }
            bufferClipped3D = bufferClipped3D.concat(workingBuffer);
        }
        var buffer = [];
        for (let i = 0; i < bufferClipped3D.length; i++) {
            buffer.push(this.triangleToCanvas(bufferClipped3D[i]));
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
