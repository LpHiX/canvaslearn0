import { rotY } from "./utils.js";
import { Vec3 } from "./structs.js";
import { Object3d } from "./class3d.js";
export class Plane extends Object3d {
    resolution;
    scale;
    pos;
    wireframe;
    fillStyle;
    constructor(resolution, scale, pos, wireframe, fillStyle) {
        super([], [], pos, new Vec3(0, 0, 0), wireframe, fillStyle);
        this.resolution = resolution;
        this.scale = scale;
        this.pos = pos;
        this.wireframe = wireframe;
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
export class Cube extends Object3d {
    scale;
    pos;
    wireframe;
    fillStyle;
    constructor(scale, pos, wireframe, fillStyle) {
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
        ], pos, new Vec3(0, 0, 0), wireframe, fillStyle);
        this.scale = scale;
        this.pos = pos;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
    }
}
export class Frustum extends Object3d {
    scale;
    pos;
    viewport;
    wireframe;
    fillStyle;
    constructor(scale, pos, viewport, wireframe, fillStyle) {
        super([
            new Vec3(-viewport.camera.near * viewport.camera.xScale, -viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
            new Vec3(viewport.camera.near * viewport.camera.xScale, -viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
            new Vec3(-viewport.camera.near * viewport.camera.xScale, viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
            new Vec3(viewport.camera.near * viewport.camera.xScale, viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
            new Vec3(-viewport.camera.far * viewport.camera.xScale, -viewport.camera.far * viewport.camera.yScale, viewport.camera.far),
            new Vec3(viewport.camera.far * viewport.camera.xScale, -viewport.camera.far * viewport.camera.yScale, viewport.camera.far),
            new Vec3(-viewport.camera.far * viewport.camera.xScale, viewport.camera.far * viewport.camera.yScale, viewport.camera.far),
            new Vec3(viewport.camera.far * viewport.camera.xScale, viewport.camera.far * viewport.camera.yScale, viewport.camera.far)
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
        ], pos, new Vec3(0, 0, 0), wireframe, fillStyle);
        this.scale = scale;
        this.pos = pos;
        this.viewport = viewport;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
    }
}
export class Torus extends Object3d {
    pos;
    wireframe;
    fillStyle;
    mainRadius;
    ringRadius;
    resolution;
    constructor(pos, wireframe, fillStyle, mainRadius, ringRadius, resolution) {
        super([], [], pos, new Vec3(0, 0, 0), wireframe, fillStyle);
        this.pos = pos;
        this.wireframe = wireframe;
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
