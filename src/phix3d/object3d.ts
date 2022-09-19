import { Vec3, Vertex, Matrix33, Triangle } from "./structs.js";
import { Texture } from "./textureloader.js";

export class Object3D{
    constructor(
        public verticies: Vertex[],
        public triIndex: number[],
        public pos: Vec3,
        public scale: Vec3,
        public eulerRot: Vec3,
        public texture: Texture 
    ){}
    getObjectTriangles(): Triangle[]{
        var objectTriangles: Triangle[] = [];
        const objectToWorldMatrix = Matrix33.RotYXZScale(this.scale, this.eulerRot);
        for(let i = 0; i < this.triIndex.length / 3; i++){
            objectTriangles.push(
                objectToWorldMatrix.transformTri(new Triangle(
                this.verticies[this.triIndex[i * 3]],
                this.verticies[this.triIndex[i * 3 + 1]],
                this.verticies[this.triIndex[i * 3 + 2]],
                this.texture
            )).addPos(this.pos));
        }
        return objectTriangles;
    }
}
export class Cube extends Object3D{
    constructor(
        public pos: Vec3,
        public texture: Texture
    ){
        super(
            [ //Verticies
                new Vertex(-0.5,  0.5, -0.5, 0.25, 0.25, 1),
                new Vertex( 0.5,  0.5, -0.5, 0.5 , 0.25, 1),
                new Vertex(-0.5, -0.5, -0.5, 0.25, 0.5 , 1),
                new Vertex( 0.5, -0.5, -0.5, 0.5 , 0.5 , 1),

                new Vertex(-0.5,  0.5,  0.5, 0.75, 0.25, 1),
                new Vertex( 0.5,  0.5,  0.5, 1   , 0.25, 1),
                new Vertex(-0.5, -0.5,  0.5, 0.75, 0.5 , 1),
                new Vertex( 0.5, -0.5,  0.5, 1   , 0.5 , 1),

                new Vertex(-0.5,  0.5,  0.5, 0   , 0.25, 1),
                new Vertex(-0.5,  0.5, -0.5, 0.25, 0.25, 1),
                new Vertex(-0.5, -0.5,  0.5, 0   , 0.5 , 1),
                new Vertex(-0.5, -0.5, -0.5, 0.25, 0.5 , 1),

                new Vertex( 0.5,  0.5, -0.5, 0.25, 0.25, 1),
                new Vertex( 0.5,  0.5,  0.5, 0.5 , 0.25, 1),
                new Vertex( 0.5, -0.5, -0.5, 0.25, 0.5 , 1),
                new Vertex( 0.5, -0.5,  0.5, 0.5 , 0.5 , 1),

                new Vertex(-0.5, -0.5,  0.5, 0.25, 0.5 , 1),
                new Vertex( 0.5, -0.5,  0.5, 0.5 , 0.5 , 1),
                new Vertex(-0.5, -0.5, -0.5, 0.25, 0.75, 1),
                new Vertex( 0.5, -0.5, -0.5, 0.5 , 0.75, 1),

                new Vertex(-0.5, 0.5, -0.5, 0.25 , 0.0  , 1),
                new Vertex( 0.5, 0.5, -0.5, 0.5  , 0.0  , 1),
                new Vertex(-0.5, 0.5,  0.5, 0.25 , 0.25 , 1),
                new Vertex( 0.5, 0.5,  0.5, 0.5  , 0.25 , 1)
            ], [ //Triangles
                0,1,3, 0,2,3,
                4,5,7, 4,6,7,
                8,9,11, 8,10,11,
                12,13,15, 12,14,15,
                16,17,19, 16,18,19,
                20,21,23, 20,22,23
            ], pos, new Vec3(1, 1, 1), new Vec3(0, 0, 0), texture);
    }
}