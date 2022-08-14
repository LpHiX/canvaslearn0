import { Cube, Plane } from "./class3d.js";
import { Camera, Viewport, rotY } from "./camera.js";
import { Vec3 } from "./structs.js";
const canvas0 = document.getElementById("canvas0");
const canvas1 = document.getElementById("canvas1");
const debugText = document.getElementById("debugText");
const cam0 = new Camera(new Vec3(0, 0, 0), 0, 0, 0);
const viewport0 = new Viewport(canvas0, cam0, 1);
const cam1 = new Camera(new Vec3(-10, 0, 0), 0, Math.PI / 2, 0);
const viewport1 = new Viewport(canvas1, cam1, 1);
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
function setup() {
    canvas0.addEventListener("mousedown", function (event) {
        down = true;
        premoveX = cam0.angleX;
        premoveY = cam0.angleY;
        startX = event.clientX;
        startY = event.clientY;
    });
    canvas0.addEventListener("mouseup", () => {
        down = false;
        premoveX = cam0.angleX;
        premoveY = cam0.angleY;
    });
    canvas0.addEventListener("touchstart", function (event) {
        down = true;
        premoveX = cam0.angleX;
        premoveY = cam0.angleY;
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });
    canvas0.addEventListener("touchend", () => {
        down = false;
        premoveX = cam0.angleX;
        premoveY = cam0.angleY;
    });
    canvas0.addEventListener("mousemove", function (event) {
        if (down) {
            cam0.angleY = premoveY + (event.clientX - startX) / 100;
            cam0.angleX = premoveX - (event.clientY - startY) / 100;
        }
    });
    canvas0.addEventListener("touchmove", function (event) {
        if (down) {
            cam0.angleY = premoveY + (event.touches[0].clientX - startX) / 100;
            cam0.angleX = premoveX - (event.touches[0].clientY - startY) / 100;
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
            default:
                break;
        }
        //event.preventDefault();
    });
}
const cube = new Cube(new Vec3(1, 1, 1), new Vec3(2, 3, 5), "rgb(0, 255, 255)");
const cube2 = new Cube(new Vec3(2, 3, 2), new Vec3(-3, 1, 4), "rgb(0, 255, 0)");
const plane = new Plane(new Vec3(10, 0, 10), new Vec3(10, 1, 10), new Vec3(0, -1, 3), "rgb(255, 100, 200");
const cam0cube = new Cube(new Vec3(1, 1, 1), new Vec3(1, 2, 1), "rgb(255, 255 ,255)");
const cam1cube = new Cube(new Vec3(1, 1, 1), new Vec3(1, 2, 1), "rgb(255, 255 ,255)");
var yvel = 0;
function frameUpdate(timestamp) {
    if (wPressed) {
        cam0.pos = cam0.pos.add(rotY(-cam0.angleY, new Vec3(0, 0, 0.1)));
    }
    if (aPressed) {
        cam0.pos = cam0.pos.add(rotY(-cam0.angleY, new Vec3(-0.1, 0, 0)));
    }
    if (sPressed) {
        cam0.pos = cam0.pos.add(rotY(-cam0.angleY, new Vec3(0, 0, -0.1)));
    }
    if (dPressed) {
        cam0.pos = cam0.pos.add(rotY(-cam0.angleY, new Vec3(0.1, 0, 0)));
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
    cam0cube.pos = cam0.pos;
    cam1cube.pos = cam1.pos;
    viewport0.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport0.ctx.fillRect(0, 0, viewport0.canvas.width, viewport0.canvas.height);
    var view0buff = [];
    view0buff = view0buff.concat(cube.getTriangles(viewport0));
    view0buff = view0buff.concat(cube2.getTriangles(viewport0));
    cube2.rotY(0.1);
    view0buff = view0buff.concat(cam1cube.getTriangles(viewport0));
    view0buff = view0buff.concat(plane.getTriangles(viewport0));
    viewport0.drawBuffer(view0buff);
    var view1buff = [];
    viewport1.ctx.fillStyle = "rgb(30, 40, 50)";
    viewport1.ctx.fillRect(0, 0, viewport1.canvas.width, viewport1.canvas.height);
    view1buff = view1buff.concat(cube.getTriangles(viewport1));
    view1buff = view1buff.concat(cube2.getTriangles(viewport1));
    cube2.rotY(0.1);
    view1buff = view1buff.concat(cam0cube.getTriangles(viewport1));
    view1buff = view1buff.concat(plane.getTriangles(viewport1));
    viewport1.drawBuffer(view1buff);
    window.requestAnimationFrame(frameUpdate);
}
setup();
window.requestAnimationFrame(frameUpdate);
