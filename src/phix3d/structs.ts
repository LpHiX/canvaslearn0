import { Texture } from "./textureloader.js";

export class Vec3{
    constructor(
        public x: number,
        public y: number,
        public z: number
    ){}
    toString(): string{
        return `Vec3(${this.x}, ${this.y}, ${this.z})`
    }
    add(other: Vec3):Vec3{
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    mul(scalar: number): Vec3{
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    static lerp(alpha:number, a:Vec3, b:Vec3):Vec3{
        return a.add(b.add(a.mul(-1)).mul(alpha));
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
    transform(matrix:Matrix33){
        return Vertex.fromVec(matrix.transform(this.pos), this.uv);
    }
    static fromVec(pos: Vec3, uv: Vec3){
        return new Vertex(pos.x, pos.y, pos.z, uv.x, uv.y, uv.z)
    }
}
export class Triangle{
    public averageZ: number
    constructor(
        public vert0: Vertex,
        public vert1: Vertex,
        public vert2: Vertex,
        public texture: Texture
    ){
        this.averageZ = (vert0.pos.z + vert1.pos.z + vert2.pos.z)/3
    }
    addPos(other: Vec3): Triangle{
        return new Triangle(
            Vertex.fromVec(this.vert0.pos.add(other), this.vert0.uv),
            Vertex.fromVec(this.vert1.pos.add(other), this.vert1.uv),
            Vertex.fromVec(this.vert2.pos.add(other), this.vert2.uv),
            this.texture
        )
    }
    project(): Triangle{
        return new Triangle(
            Vertex.fromVec(new Vec3(this.vert0.pos.x / this.vert0.pos.z, this.vert0.pos.x / this.vert0.pos.z, this.vert0.pos.z), this.vert0.uv),
            Vertex.fromVec(new Vec3(this.vert1.pos.x / this.vert1.pos.z, this.vert1.pos.x / this.vert1.pos.z, this.vert1.pos.z), this.vert1.uv),
            Vertex.fromVec(new Vec3(this.vert2.pos.x / this.vert2.pos.z, this.vert2.pos.x / this.vert2.pos.z, this.vert2.pos.z), this.vert2.uv),
            this.texture
        );
    }
    toScreen(width: number, height: number, sizeX: number, sizeY: number): Triangle{
        const canvasMin = Math.min(width, height);
        return new Triangle(
            Vertex.fromVec(new Vec3(width / 2 + this.vert0.pos.x / sizeX * canvasMin / 2, height / 2 - this.vert0.pos.y / sizeY * canvasMin / 2, this.vert0.pos.z), this.vert0.uv),
            Vertex.fromVec(new Vec3(width / 2 + this.vert1.pos.x / sizeX * canvasMin / 2, height / 2 - this.vert1.pos.y / sizeY * canvasMin / 2, this.vert1.pos.z), this.vert1.uv),
            Vertex.fromVec(new Vec3(width / 2 + this.vert2.pos.x / sizeX * canvasMin / 2, height / 2 - this.vert2.pos.y / sizeY * canvasMin / 2, this.vert2.pos.z), this.vert2.uv),
            this.texture
        )
    }
}
export class Matrix33{
    constructor(
        public values: number[][]
    ){}
    add(other: Matrix33): Matrix33{
        var outMatrix = new Matrix33([]);
        for(let col = 0; col < 3; col++){
            var outCol = [];
            for(let row = 0; row < 3; row++){
                outCol.push(other.values[col][row] + this.values[col][row])
            }
            outMatrix.values.push(outCol);
        }
        return outMatrix;
    }
    multiply(other:Matrix33): Matrix33{ // [OTHER][THIS]
        var outMatrix = new Matrix33([]);
        for (let col = 0; col < 3; col++){
            var outCol = [0, 0, 0];
            for(let row = 0; row < 3; row++){
                outCol = [
                    outCol[0] + this.values[col][row] * other.values[row][0],
                    outCol[1] + this.values[col][row] * other.values[row][1],
                    outCol[2] + this.values[col][row] * other.values[row][2]
                ]
            }
            outMatrix.values.push(outCol);
        }
        return outMatrix;
    }
    transform(other:Vec3): Vec3{
        return new Vec3(
            other.x * this.values[0][0] + other.y * this.values[0][1] + other.z * this.values[0][2],
            other.x * this.values[1][0] + other.y * this.values[1][1] + other.z * this.values[1][2],
            other.x * this.values[2][0] + other.y * this.values[2][1] + other.z * this.values[2][2],
        )
    }
    transformTri(other: Triangle): Triangle{
        return new Triangle(
            Vertex.fromVec(this.transform(other.vert0.pos), other.vert0.uv),
            Vertex.fromVec(this.transform(other.vert1.pos), other.vert1.uv),
            Vertex.fromVec(this.transform(other.vert2.pos), other.vert2.uv),
            other.texture
        )
    }
    static rotX(angle:number): Matrix33{
        return new Matrix33([
            [1, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle)],
            [0, Math.sin(angle), Math.cos(angle)],
        ]);
    }
    static rotY(angle:number): Matrix33{
        return new Matrix33([
            [Math.cos(angle), 0, -Math.sin(angle)],
            [0, 1, 0],
            [Math.sin(angle), 0, Math.cos(angle)]
        ]);
    }
    static rotZ(angle:number): Matrix33{
        return new Matrix33([
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ]);
    }
    static scale(scale: Vec3): Matrix33{
        return new Matrix33([
            [scale.x, 0, 0],
            [0, scale.y, 0],
            [0, 0, scale.y]
        ]);
    }
    static RotYXZScale(scale: Vec3, eulerRot:Vec3){
        return Matrix33.rotY(eulerRot.y)
        .multiply(Matrix33.rotX(eulerRot.x)
        .multiply(Matrix33.rotZ(eulerRot.z)
        .multiply(Matrix33.scale(scale))));
    }
}