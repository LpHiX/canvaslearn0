export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    mul(scalar) {
        return new Vec2(this.x * scalar, this.y * scalar);
    }
}
export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(other) {
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    mul(scalar) {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    static lerp(alpha, a, b) {
        return a.add(b.add(a.mul(-1)).mul(alpha));
    }
}
export class Triangle {
    constructor(vert0, vert1, vert2, wireframe, fillStyle) {
        this.vert0 = vert0;
        this.vert1 = vert1;
        this.vert2 = vert2;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
        this.avgZ = (vert0.z + vert1.z + vert2.z) / 3;
    }
}
export class Triangle2 {
    constructor(vert0, vert1, vert2, wireframe, fillStyle) {
        this.vert0 = vert0;
        this.vert1 = vert1;
        this.vert2 = vert2;
        this.wireframe = wireframe;
        this.fillStyle = fillStyle;
    }
}
