import {World} from "./class3d.js";
import {Cube, Frustum, Plane, Torus} from "./shapes.js";
import {Camera, Viewport} from "./camera.js";
import {Vec3, Vec2, Triangle} from "./structs.js";
import { Controls } from "./controls.js";
import {rotX, rotY, rotZ} from "./utils.js";

const canvas0 = document.getElementById("canvas0") as HTMLCanvasElement;
const canvas1 = document.getElementById("canvas1") as HTMLCanvasElement;
const debugText = document.getElementById("debugText") as HTMLDivElement;


const cube = new Cube(new Vec3(1, 1, 1), new Vec3( 2, 3, 5), false, "rgb(0, 255, 255)");
const cube2 = new Cube(new Vec3(2, 3, 2), new Vec3( -3, 1, 4), false, "rgb(0, 255, 0)");
const plane = new Plane(new Vec3(10, 0, 10), new Vec3(10, 1, 10), new Vec3(0, -1, 3), false, "rgb(255, 100, 200");
const cam0debug = new Cube(new Vec3(2, 2, 1), new Vec3(0, 0, 0), true, "rgb(255,255,255)");
const torus = new Torus(new Vec3( 2, 3, 5), true, "rgb(0, 0, 255)", 3, 0.5, new Vec3(12, 20, 0));
const cam0cube = new Cube(new Vec3(0.5, 0.5, 0.5), new Vec3( 1, 2, 1), false, "rgb(255, 255 ,255)");
const cam1cube = new Cube(new Vec3(0.5, 0.5, 0.5), new Vec3( 1, 2, 1), false, "rgb(255, 255 ,255)");
const cam0 = new Camera(new Vec3(0,0,0), new Vec3(0, 0, 0), cam0cube, 1, 10);
const cam1 = new Camera(new Vec3(-10,0,0), new Vec3(0, -Math.PI / 2, 0), cam1cube, 1, 10);
const viewport0 = new Viewport(canvas0, cam0, 1);
const viewport1 = new Viewport(canvas1, cam1, 1);
const cam0frust = new Frustum(new Vec3(1, 1, 1), new Vec3(1, 1, 1), viewport0, true, "rgb(255, 255, 255)");
const controls = new Controls(canvas0, canvas1, cam0, cam1)
const world0 = new World()
world0.objects = [cube, cube2, plane, cam1cube, cam0cube, torus, cam0frust]

function frameUpdate(timestamp:number){
    controls.updateUser();

    viewport0.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport0.ctx.fillRect(0, 0, viewport0.canvas.width, viewport0.canvas.height);
    viewport0.drawWorld(world0, [cam0cube, cam0frust, cam0debug]);

    viewport1.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport1.ctx.fillRect(0, 0, viewport1.canvas.width, viewport1.canvas.height);
    viewport1.drawWorld(world0, [cam1cube]);

    cam0cube.eulerRot = cam0.eulerRot;
    cube2.eulerRot = cube2.eulerRot.add(new Vec3(1, 0, 0).mul(0.01));
    cam0debug.eulerRot = cam0.eulerRot;
    cam0frust.eulerRot = cam0.eulerRot;
    torus.eulerRot = torus.eulerRot.add(new Vec3(0.1, 0.1, 0.1).mul(0.1))

    cam0cube.pos = cam0.pos;
    cam0debug.pos = cam0.pos.add(rotY(cam0.eulerRot.y, rotX(cam0.eulerRot.x, new Vec3(0, 0, 0.5))));
    cam0frust.pos = cam0.pos
    cam1cube.pos = cam1.pos;

    debugText.innerText = cam0.eulerRot.x.toString();

    window.requestAnimationFrame(frameUpdate);
}
controls.setup();
window.requestAnimationFrame(frameUpdate);