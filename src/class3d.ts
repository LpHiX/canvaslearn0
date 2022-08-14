import {Viewport, rotX, rotY, rotZ, Triangle} from "./camera.js";
import {Vec3} from "./structs.js";

abstract class object3d{
    constructor(
        public verticies: Vec3[],
        public triangles: number[],
        public pos: Vec3,
        public fillStyle: string
    ){}
    getTriangles(viewport: Viewport): Triangle[]{
        var buffer: Triangle[] = [];
    
        for(var i = 0; i < this.triangles.length / 3; i++){
            const corner0 = viewport.vecToCanvas(this.verticies[this.triangles[i* 3]].add(this.pos));
            const corner1 = viewport.vecToCanvas(this.verticies[this.triangles[i* 3 + 1]].add(this.pos));
            const corner2 = viewport.vecToCanvas(this.verticies[this.triangles[i* 3 + 2]].add(this.pos));
            if(corner0 !== null && corner1 !== null && corner2 !== null){
                buffer.push(new Triangle(corner0, corner1, corner2, this.fillStyle));
            }
        }
        return buffer;
    }
    rotY(angle: number): void {
        for(var i = 0; i < this.verticies.length; i++){
            this.verticies[i] = rotY(angle, this.verticies[i]);
        }
    }
}
export class Cube extends object3d{
    constructor(
        public scale: Vec3,
        public pos: Vec3,
        public fillStyle: string
    ){
        super(
            [ //Verticies
                new Vec3(-0.5 * scale.x, -0.5 * scale.y, -0.5*scale.z),
                new Vec3( 0.5 * scale.x, -0.5 * scale.y, -0.5*scale.z),
                new Vec3(-0.5 * scale.x,  0.5 * scale.y, -0.5*scale.z),
                new Vec3( 0.5 * scale.x,  0.5 * scale.y, -0.5*scale.z),
                new Vec3(-0.5 * scale.x, -0.5 * scale.y,  0.5*scale.z),
                new Vec3( 0.5 * scale.x, -0.5 * scale.y,  0.5*scale.z),
                new Vec3(-0.5 * scale.x,  0.5 * scale.y,  0.5*scale.z),
                new Vec3( 0.5 * scale.x,  0.5 * scale.y,  0.5*scale.z)
            ], [ //Triangles
                0,1,3,
                0,2,3,
                4,5,7,
                4,6,7,
                0,4,6,
                0,2,6,
                1,3,7,
                1,5,7,
                0,1,5,
                0,4,5,
                2,3,7,
                2,6,7
            ], pos, fillStyle);
    }
}
export class Plane extends object3d{
    constructor(
        public resolution: Vec3,
        public scale: Vec3,
        public pos: Vec3,
        public fillStyle: string
    ){
        super(
            [], [], pos, fillStyle
        );
        for(var z = 0; z <= resolution.z; z++){
            for(var x = 0; x <= resolution.x; x++){
                const newPoint = Vec3.lerp(z / resolution.z, 
                Vec3.lerp(x / resolution.x, new Vec3(-scale.x / 2, 0, -scale.z / 2), new Vec3(scale.x / 2, 0, -scale.z / 2)), 
                Vec3.lerp(x / resolution.x, new Vec3(-scale.x / 2, 0, scale.z / 2), new Vec3(scale.x / 2, 0, scale.z / 2)));
                this.verticies.push(newPoint);
            }
        }
        for(var y = 0; y < resolution.z; y++) {
            for(var x = 0; x < resolution.x; x++) {
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
export class Torus extends object3d{
    constructor(
        public plane:Plane,
        public pos:Vec3,
        public fillStyle:string
    ){
        super([], [], pos, fillStyle);
    }
}