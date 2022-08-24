import { Cube, Plane, Torus, World } from "./class3d.js";
import { Camera, Viewport, rotX, rotY } from "./camera.js";
import { Vec3 } from "./structs.js";
const canvas0 = document.getElementById("canvas0");
const canvas1 = document.getElementById("canvas1");
const debugText = document.getElementById("debugText");
let forward = false;
let down = false;
let startX = 0;
let startY = 0;
let premoveY = 0;
let premoveX = 0;
let wPressed = false;
let aPressed = false;
let sPressed = false;
let dPressed = false;
let spacePressed = false;
let iPressed = false;
let jPressed = false;
let kPressed = false;
let lPressed = false;
function setup() {
    canvas0.addEventListener("mousedown", function (event) {
        down = true;
        premoveX = cam0.eulerRot.x;
        premoveY = cam0.eulerRot.y;
        startX = event.clientX;
        startY = event.clientY;
    });
    canvas0.addEventListener("mouseup", () => {
        down = false;
        premoveX = cam0.eulerRot.x;
        premoveY = cam0.eulerRot.y;
    });
    canvas0.addEventListener("mousemove", function (event) {
        if (down) {
            cam0.eulerRot.y = premoveY - (event.clientX - startX) / 100;
            cam0.eulerRot.x = premoveX + (event.clientY - startY) / 100;
        }
    });
    canvas1.addEventListener("mousedown", function (event) {
        down = true;
        premoveX = cam1.eulerRot.x;
        premoveY = cam1.eulerRot.y;
        startX = event.clientX;
        startY = event.clientY;
    });
    canvas1.addEventListener("mouseup", () => {
        down = false;
        premoveX = cam1.eulerRot.x;
        premoveY = cam1.eulerRot.y;
    });
    canvas1.addEventListener("mousemove", function (event) {
        if (down) {
            cam1.eulerRot.y = premoveY - (event.clientX - startX) / 100;
            cam1.eulerRot.x = premoveX + (event.clientY - startY) / 100;
        }
    });
    canvas0.addEventListener("touchstart", function (event) {
        down = true;
        forward = true;
        premoveX = cam0.eulerRot.x;
        premoveY = cam0.eulerRot.y;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    canvas0.addEventListener("touchend", () => {
        down = false;
        forward = false;
        premoveX = cam0.eulerRot.x;
        premoveY = cam0.eulerRot.y;
    });
    canvas0.addEventListener("touchmove", function (event) {
        if (down) {
            cam0.eulerRot.y = premoveY - (event.touches[0].clientX - startX) / 100;
            cam0.eulerRot.x = premoveX + (event.touches[0].clientY - startY) / 100;
        }
    });
    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "w":
                wPressed = true;
                break;
            case "a":
                aPressed = true;
                break;
            case "s":
                sPressed = true;
                break;
            case "d":
                dPressed = true;
                break;
            case " ":
                spacePressed = true;
                break;
            case "i":
                iPressed = true;
                break;
            case "j":
                jPressed = true;
                break;
            case "k":
                kPressed = true;
                break;
            case "l":
                lPressed = true;
                break;
            default:
                break;
        }
        //event.preventDefault();
    });
    document.addEventListener("keyup", function (event) {
        switch (event.key) {
            case "w":
                wPressed = false;
                break;
            case "a":
                aPressed = false;
                break;
            case "s":
                sPressed = false;
                break;
            case "d":
                dPressed = false;
                break;
            case " ":
                spacePressed = false;
                break;
            case "i":
                iPressed = false;
                break;
            case "j":
                jPressed = false;
                break;
            case "k":
                kPressed = false;
                break;
            case "l":
                lPressed = false;
                break;
            default:
                break;
        }
        //event.preventDefault();
    });
}
function updateUser() {
    if (wPressed) {
        cam0.pos = cam0.pos.add(rotY(cam0.eulerRot.y, new Vec3(0, 0, 0.1)));
    }
    if (aPressed) {
        cam0.pos = cam0.pos.add(rotY(cam0.eulerRot.y, new Vec3(-0.1, 0, 0)));
    }
    if (sPressed) {
        cam0.pos = cam0.pos.add(rotY(cam0.eulerRot.y, new Vec3(0, 0, -0.1)));
    }
    if (dPressed) {
        cam0.pos = cam0.pos.add(rotY(cam0.eulerRot.y, new Vec3(0.1, 0, 0)));
    }
    if (iPressed) {
        cam1.pos = cam1.pos.add(rotY(cam1.eulerRot.y, new Vec3(0, 0, 0.1)));
    }
    if (jPressed) {
        cam1.pos = cam1.pos.add(rotY(cam1.eulerRot.y, new Vec3(-0.1, 0, 0)));
    }
    if (kPressed) {
        cam1.pos = cam1.pos.add(rotY(cam1.eulerRot.y, new Vec3(0, 0, -0.1)));
    }
    if (lPressed) {
        cam1.pos = cam1.pos.add(rotY(cam1.eulerRot.y, new Vec3(0.1, 0, 0)));
    }
    if (cam0.pos.y > 0) {
        yvel -= 1;
        cam0.pos.y += yvel / 75;
    }
    else {
        cam0.pos.y = 0;
        yvel = 0;
        if (spacePressed) {
            yvel = 20;
            cam0.pos.y += 0.1;
        }
    }
    if (forward) {
        cam0.pos = cam0.pos.add(rotY(cam0.eulerRot.y, new Vec3(0, 0, 0.1)));
    }
    cam0cube.pos = cam0.pos;
    cam0debug.pos = cam0.pos.add(rotY(cam0.eulerRot.y, rotX(cam0.eulerRot.x, new Vec3(0, 0, 1))));
    cam1cube.pos = cam1.pos;
}
const cube = new Cube(new Vec3(1, 1, 1), new Vec3(2, 3, 5), false, "rgb(0, 255, 255)");
const cube2 = new Cube(new Vec3(2, 3, 2), new Vec3(-3, 1, 4), false, "rgb(0, 255, 0)");
const plane = new Plane(new Vec3(10, 0, 10), new Vec3(10, 1, 10), new Vec3(0, -1, 3), false, "rgb(255, 100, 200");
const cam0cube = new Cube(new Vec3(1, 1, 1), new Vec3(1, 2, 1), false, "rgb(255, 255 ,255)");
const cam0debug = new Cube(new Vec3(2, 2, 1), new Vec3(0, 0, 0), true, "rgb(255,255,255)");
const cam1cube = new Cube(new Vec3(1, 1, 1), new Vec3(1, 2, 1), false, "rgb(255, 255 ,255)");
const torus = new Torus(new Vec3(2, 3, 5), true, "rgb(0, 0, 255)", 3, 0.5, new Vec3(12, 20, 0));
const cam0 = new Camera(new Vec3(0, 0, 0), new Vec3(0, 0, 0), cam0cube, .01, 10);
const viewport0 = new Viewport(canvas0, cam0, 1);
const cam1 = new Camera(new Vec3(-10, 0, 0), new Vec3(0, -Math.PI / 2, 0), cam1cube, 1, 10);
const viewport1 = new Viewport(canvas1, cam1, 1);
const world0 = new World();
world0.objects = [cube, cube2, plane, cam1cube, cam0cube, torus, cam0debug];
var yvel = 0;
function frameUpdate(timestamp) {
    updateUser();
    viewport0.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport0.ctx.fillRect(0, 0, viewport0.canvas.width, viewport0.canvas.height);
    viewport0.drawWorld(world0, null);
    viewport1.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport1.ctx.fillRect(0, 0, viewport1.canvas.width, viewport1.canvas.height);
    viewport1.drawWorld(world0, viewport0);
    cam0cube.eulerRot = cam0.eulerRot;
    cube2.eulerRot = cube2.eulerRot.add(new Vec3(1, 0, 0).mul(0.01));
    cam0debug.eulerRot = cam0.eulerRot;
    torus.eulerRot = torus.eulerRot.add(new Vec3(0.1, 0.1, 0.1).mul(0.1));
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
