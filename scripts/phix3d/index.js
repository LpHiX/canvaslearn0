import { Camera, Viewport } from "./camera.js";
import { Vec3 } from "./structs.js";
const canvas0 = document.getElementById("canvas");
const cam0 = new Camera(new Vec3(0, 0, 0), new Vec3(0, 0, 0), 1, 1, 0.1);
const viewport0 = new Viewport(canvas0, cam0);
document.images;
function setup() {
}
function mainLoop(timestamp) {
    requestAnimationFrame(mainLoop);
}
setup();
requestAnimationFrame(mainLoop);
