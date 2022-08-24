import { rotY, rotYXZ, Triangle } from "./camera.js";
import { Vec3 } from "./structs.js";
class Object3d {
    constructor(verticies, triangles, pos, eulerRot, fillStyle) {
        this.verticies = verticies;
        this.triangles = triangles;
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.fillStyle = fillStyle;
    }
    getTriangles(viewport) {
        var buffer = [];
        for (var i = 0; i < this.triangles.length / 3; i++) {
            const corner0 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3]]).add(this.pos));
            const corner1 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 1]]).add(this.pos));
            const corner2 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i * 3 + 2]]).add(this.pos));
            if (corner0 !== null && corner1 !== null && corner2 !== null) {
                buffer.push(new Triangle(corner0, corner1, corner2, this.fillStyle));
            }
        }
        return buffer;
    }
}
export class Cube extends Object3d {
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
        ], pos, new Vec3(0, 0, 0), fillStyle);
        this.scale = scale;
        this.pos = pos;
        this.fillStyle = fillStyle;
    }
}
export class World {
    constructor() {
        this.objects = [];
    }
    createTriangleBuffer() {
        this.objects.forEach(object => {
        });
    }
}
export class Plane extends Object3d {
    constructor(resolution, scale, pos, fillStyle) {
        super([], [], pos, new Vec3(0, 0, 0), fillStyle);
        this.resolution = resolution;
        this.scale = scale;
        this.pos = pos;
        this.fillStyle = fillStyle;
        for (var z = 0; z <= resolution.z; z++) {
            for (var x = 0; x <= resolution.x; x++) {
                const newPoint = Vec3.lerp(z / resolution.z, Vec3.lerp(x / resolution.x, new Vec3(-scale.x / 2, 0, -scale.z / 2), new Vec3(scale.x / 2, 0, -scale.z / 2)), Vec3.lerp(x / resolution.x, new Vec3(-scale.x / 2, 0, scale.z / 2), new Vec3(scale.x / 2, 0, scale.z / 2)));
                this.verticies.push(newPoint);
            }
        }
        for (var y = 0; y < resolution.z; y++) {
            for (var x = 0; x < resolution.x; x++) {
                this.triangles.push(x + y * (resolution.x + 1));
                this.triangles.push(x + y * (resolution.x + 1) + 1);
                this.triangles.push(x + (y + 1) * (resolution.x + 1) + 1);
                this.triangles.push(x + y * (resolution.x + 1));
                this.triangles.push(x + (y + 1) * (resolution.x + 1));
                this.triangles.push(x + (y + 1) * (resolution.x + 1) + 1);
            }
        }
    }
}
export class Torus extends Object3d {
    constructor(pos, fillStyle, mainRadius, ringRadius, resolution) {
        super([], [], pos, new Vec3(0, 0, 0), fillStyle);
        this.pos = pos;
        this.fillStyle = fillStyle;
        this.mainRadius = mainRadius;
        this.ringRadius = ringRadius;
        this.resolution = resolution;
        for (var y = 0; y <= resolution.y; y++) {
            for (var x = 0; x <= resolution.x; x++) {
                const angleX = 2 * Math.PI * x / resolution.x;
                const angleY = 2 * Math.PI * y / resolution.y;
                this.verticies.push(rotY(angleY, new Vec3(ringRadius * Math.cos(angleX), ringRadius * Math.sin(angleX), 0))
                    .add(new Vec3(mainRadius * Math.cos(angleY), 0, mainRadius * Math.sin(angleY))));
            }
        }
        for (var y = 0; y < resolution.y; y++) {
            for (var x = 0; x < resolution.x; x++) {
                this.triangles.push(x + y * (resolution.x + 1));
                this.triangles.push(x + y * (resolution.x + 1) + 1);
                this.triangles.push(x + (y + 1) * (resolution.x + 1) + 1);
                this.triangles.push(x + y * (resolution.x + 1));
                this.triangles.push(x + (y + 1) * (resolution.x + 1));
                this.triangles.push(x + (y + 1) * (resolution.x + 1) + 1);
            }
        }
    }
}
