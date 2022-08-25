import {Viewport} from "./camera.js";
import {rotX, rotY, rotZ, rotYXZ} from "./utils.js";
import {Vec3, Triangle} from "./structs.js";
import { Object3d } from "./class3d.js";
export class Plane extends Object3d{
    constructor(
        public resolution: Vec3,
        public scale: Vec3,
        public pos: Vec3,
        public wireframe: boolean,
        public fillStyle: string
    ){
        super(
            [], [], pos, new Vec3(0,0,0), wireframe, fillStyle
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
export class Cube extends Object3d{
    constructor(
        public scale: Vec3,
        public pos: Vec3,
        public wireframe: boolean,
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
            ], pos, new Vec3(0,0,0), wireframe, fillStyle);
    }
}
export class Frustum extends Object3d{
    constructor(
        public scale: Vec3,
        public pos: Vec3,
        public viewport: Viewport,
        public wireframe: boolean,
        public fillStyle: string
    ){
        super(
            [ //Verticies
                new Vec3(-viewport.camera.near * viewport.camera.xScale, -viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
                new Vec3( viewport.camera.near * viewport.camera.xScale, -viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
                new Vec3(-viewport.camera.near * viewport.camera.xScale,  viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
                new Vec3( viewport.camera.near * viewport.camera.xScale,  viewport.camera.near * viewport.camera.yScale, viewport.camera.near),
                new Vec3(-viewport.camera.far  * viewport.camera.xScale, -viewport.camera.far *  viewport.camera.yScale, viewport.camera.far),
                new Vec3( viewport.camera.far  * viewport.camera.xScale, -viewport.camera.far *  viewport.camera.yScale, viewport.camera.far),
                new Vec3(-viewport.camera.far  * viewport.camera.xScale,  viewport.camera.far *  viewport.camera.yScale, viewport.camera.far),
                new Vec3( viewport.camera.far  * viewport.camera.xScale,  viewport.camera.far *  viewport.camera.yScale, viewport.camera.far)
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
            ], pos, new Vec3(0,0,0), wireframe, fillStyle);
    }
}
export class Torus extends Object3d{
    constructor(
        public pos:Vec3,
        public wireframe: boolean,
        public fillStyle:string,
        private mainRadius: number,
        private ringRadius: number,
        private resolution: Vec3
    ){
        super([], [], pos, new Vec3(0,0,0), wireframe, fillStyle);
        for(var y = 0; y <= resolution.y; y++){
            for(var x = 0; x <= resolution.x; x++){
                const angleX = 2 * Math.PI * x / resolution.x;
                const angleY = 2 * Math.PI * y / resolution.y;
                this.verticies.push(
                    rotY(angleY, new Vec3(ringRadius * Math.cos(angleX), ringRadius * Math.sin(angleX), 0))
                    .add(
                    new Vec3(mainRadius * Math.cos(angleY), 0, mainRadius * Math.sin(angleY)))
                );
            }
        }
        for(var y = 0; y < resolution.y; y++) {
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