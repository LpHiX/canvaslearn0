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
