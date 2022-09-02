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
}
export class Vertex {
    constructor(x, y, z, u, v, w) {
        this.pos = new Vec3(x, y, z);
        this.uv = new Vec3(u, v, w);
    }
    static fromVec(pos, uv) {
        return new Vertex(pos.x, pos.y, pos.z, uv.x, uv.y, uv.z);
    }
}
export class Triangle {
    constructor(vert0, vert1, vert2) {
        this.vert0 = vert0;
        this.vert1 = vert1;
        this.vert2 = vert2;
    }
}
export class Matrix33 {
    constructor(values) {
        this.values = values;
    }
    multiplyMat(other) {
    }
    multiplyVec(other) {
    }
}
