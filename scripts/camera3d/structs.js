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
    toString() {
        return "Vec3(" + this.x + ", " + this.y + ", " + this.z + ")";
    }
}
export class Side {
    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    signedDistance(vert) {
        return (vert.x * this.x + vert.y * this.y + vert.z * this.z - this.w);
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
