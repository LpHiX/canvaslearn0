import { rotY, Triangle } from "./camera.js";
import { Vec3 } from "./structs.js";
class object3d {
    constructor(verticies, triangles, pos, fillStyle) {
        this.verticies = verticies;
        this.triangles = triangles;
        this.pos = pos;
        this.fillStyle = fillStyle;
    }
    getTriangles(viewport) {
        var buffer = [];
        for (var i = 0; i < this.triangles.length / 3; i++) {
            const corner0 = viewport.vecToCanvas(this.verticies[this.triangles[i * 3]].add(this.pos));
            const corner1 = viewport.vecToCanvas(this.verticies[this.triangles[i * 3 + 1]].add(this.pos));
            const corner2 = viewport.vecToCanvas(this.verticies[this.triangles[i * 3 + 2]].add(this.pos));
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer.push(new Triangle(corner0, corner1, corner2, this.fillStyle));
            }
        }
        return buffer;
    }
    rotY(angle) {
        for (var i = 0; i < this.verticies.length; i++) {
            this.verticies[i] = rotY(angle, this.verticies[i]);
        }
    }
}
export class Cube extends object3d {
    constructor(scale, pos, fillStyle) {
        super([
            new Vec3(-0.5 * scale.x, -0.5 * scale.y, -0.5 * scale.z),
            new Vec3(0.5 * scale.x, -0.5 * scale.y, -0.5 * scale.z),
            new Vec3(-0.5 * scale.x, 0.5 * scale.y, -0.5 * scale.z),
            new Vec3(0.5 * scale.x, 0.5 * scale.y, -0.5 * scale.z),
            new Vec3(-0.5 * scale.x, -0.5 * scale.y, 0.5 * scale.z),
            new Vec3(0.5 * scale.x, -0.5 * scale.y, 0.5 * scale.z),
            new Vec3(-0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z),
            new Vec3(0.5 * scale.x, 0.5 * scale.y, 0.5 * scale.z)
        ], [
            0, 1, 3,
            0, 2, 3,
            4, 5, 7,
            4, 6, 7,
            0, 4, 6,
            0, 2, 6,
            1, 3, 7,
            1, 5, 7,
            0, 1, 5,
            0, 4, 5,
            2, 3, 7,
            2, 6, 7
        ], pos, fillStyle);
        this.scale = scale;
        this.pos = pos;
        this.fillStyle = fillStyle;
    }
}
export class Plane extends object3d {
    constructor(size, scale, pos, fillStyle) {
        super([], [], pos, fillStyle);
        this.size = size;
        this.scale = scale;
        this.pos = pos;
        this.fillStyle = fillStyle;
        for (var z = 0; z <= size; z++) {
            for (var x = 0; x <= size; x++) {
                const newPoint = Vec3.lerp(z / size, Vec3.lerp(x / size, new Vec3(-scale.x / 2, 0, -scale.z / 2), new Vec3(scale.x / 2, 0, -scale.z / 2)), Vec3.lerp(x / size, new Vec3(-scale.x / 2, 0, scale.z / 2), new Vec3(scale.x / 2, 0, scale.z / 2)));
                this.verticies.push(newPoint);
            }
        }
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                this.triangles.push(x + y * (size + 1));
                this.triangles.push(x + y * (size + 1) + 1);
                this.triangles.push(x + (y + 1) * (size + 1) + 1);
                this.triangles.push(x + y * (size + 1));
                this.triangles.push(x + (y + 1) * (size + 1));
                this.triangles.push(x + (y + 1) * (size + 1) + 1);
            }
        }
    }
}
