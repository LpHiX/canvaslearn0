import {rotX, rotY, rotZ, rotYXZ} from "./utils.js";
import {Vec3, Triangle, Triangle2} from "./structs.js";
import { Viewport } from "./camera.js";

export abstract class Object3d{
    constructor(
        public verticies: Vec3[],
        public triangles: number[],
        public pos: Vec3,
        public eulerRot: Vec3,
        public wireframe: boolean,
        public fillStyle: string
    ){
    }
    getTriangles(viewport: Viewport): Triangle[]{
        var buffer: Triangle[] = [];
    
        for(var i = 0; i < this.triangles.length / 3; i++){
            const corner0 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3    ]]).add(this.pos), true, true);
            const corner1 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3 + 1]]).add(this.pos), true, true);
            const corner2 = viewport.vecToCanvas(rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3 + 2]]).add(this.pos), true, true);
            if(corner0 !== null && corner1 !== null && corner2 !== null){
                buffer.push(new Triangle(corner0, corner1, corner2, this.wireframe, this.fillStyle));
            }
        }
        return buffer;
    }
    getTriangles2(): Triangle2[]{
        var buffer: Triangle2[] = [];
    
        for(var i = 0; i < this.triangles.length / 3; i++){
            const corner0 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3    ]]).add(this.pos);
            const corner1 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3 + 1]]).add(this.pos);
            const corner2 = rotYXZ(this.eulerRot, this.verticies[this.triangles[i* 3 + 2]]).add(this.pos);
            buffer.push(new Triangle(corner0, corner1, corner2, this.wireframe, this.fillStyle));
        }
        return buffer;
    }
}
export class World{
    objects: Object3d[];
    constructor(){
        this.objects = [];
    }
    load3dBuffer(excludedObjects: Object3d[]):Triangle2[]{
        var buffer:Triangle2[] = [];
        this.objects.forEach(object =>{
            if(!excludedObjects.includes(object)){
                buffer = buffer.concat(object.getTriangles2());
            }
        })
        return buffer;
    }
}
