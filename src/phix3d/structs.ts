export class Vec3{
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ){}
    add(other: Vec3):Vec3{
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    mul(scalar: number): Vec3{
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
}
export class Vertex{
    pos: Vec3;
    uv: Vec3;
    constructor(
        x: number,
        y: number,
        z: number,
        u: number,
        v: number,
        w: number
    ){
        this.pos = new Vec3(x, y, z);
        this.uv = new Vec3(u, v, w);
    }
    static fromVec(pos: Vec3, uv: Vec3){
        return new Vertex(pos.x, pos.y, pos.z, uv.x, uv.y, uv.z)
    }
}
export class Triangle{
    constructor(
        public vert0: Vertex,
        public vert1: Vertex,
        public vert2: Vertex
    ){}
}
export class Matrix33{
    constructor(
        public values: number[][]
    ){}
    multiplyMat(other:Matrix33){

    }
    multiplyVec(other:Vec3){

    }
}