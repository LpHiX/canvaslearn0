"use strict";
var camera3d;
(function (camera3d) {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const debugText = document.getElementById("debugText");
    class projection {
        constructor() { }
    }
    class Vec2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        mul(scalar) {
            return new Vec2(this.x * scalar, this.y * scalar);
        }
    }
    class Vec3 {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        add(other) {
            return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
        }
        mul(scalar) {
            return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
        }
        static lerp(alpha, a, b) {
            return a.add(b.add(a.mul(-1)).mul(alpha));
        }
    }
    class Camera {
        constructor(pos, angleY, angleX) {
            this.pos = pos;
            this.angleY = angleY;
            this.angleX = angleX;
        }
    }
    class Util {
        constructor(size) {
            this.size = size;
            this.canvasMin = Math.min(canvas.width, canvas.height);
        }
        c2g(coord) {
            return new Vec3(coord.x / canvas.width * 2 - 1, 1 - coord.y / canvas.height * 2, 0).mul(this.size);
        }
        g2c(coord) {
            return new Vec3(canvas.width / 2 + coord.x / this.size * canvas.width / 2, canvas.height / 2 - coord.y / this.size * canvas.height / 2, 0);
        }
        vecToGrid(coord) {
            return new Vec2(coord.x / (coord.z), coord.y / (coord.z));
        }
        rotZ(coord, angle) {
            return new Vec3(coord.x * Math.cos(angle) - coord.y * Math.sin(angle), coord.x * Math.sin(angle) + coord.y * Math.cos(angle), coord.z);
        }
        rotX(coord, angle) {
            return new Vec3(coord.x, coord.y * Math.cos(angle) - coord.z * Math.sin(angle), coord.y * Math.sin(angle) + coord.z * Math.cos(angle));
        }
        rotY(coord, angle) {
            return new Vec3(coord.x * Math.cos(angle) - coord.z * Math.sin(angle), coord.y, coord.x * Math.sin(angle) + coord.z * Math.cos(angle));
        }
        vecToCanvas(coord) {
            return this.g2c(this.vecToGrid(util.rotX(util.rotY(coord, cam.angleY), cam.angleX)));
        }
    }
    let down = false;
    let startX = 0;
    let startY = 0;
    let premoveY = 0;
    let premoveX = 0;
    class Cube {
        constructor(pos, scale, fillStyle) {
            this.pos = pos;
            this.scale = scale;
            this.fillStyle = fillStyle;
            this.verticies = [];
            this.triangles = [];
        }
    }
    class Plane {
        constructor(corners, size, color) {
            this.corners = corners;
            this.size = size;
            this.color = color;
            this.verticies = [];
            this.triangles = [];
            for (var y = 0; y <= size; y++) {
                for (var x = 0; x <= size; x++) {
                    const newPoint = Vec3.lerp(y / size, Vec3.lerp(x / size, corners[0], corners[1]), Vec3.lerp(x / size, corners[2], corners[3]));
                    this.verticies.push(newPoint);
                }
            }
            for (var y = 0; y < size; y++) {
                for (var x = 0; x < size; x++) {
                    this.triangles.push(x + y * (size + 1));
                    this.triangles.push(x + 1);
                    this.triangles.push(x + (size + 1) + 1);
                    this.triangles.push(x);
                    this.triangles.push(x + (size + 1));
                    this.triangles.push(x + (size + 1) + 1);
                }
            }
        }
    }
    const cube = [
        new Vec3(-1 + 3, -1 + 3, 5),
        new Vec3(1 + 3, -1 + 3, 5),
        new Vec3(1 + 3, 1 + 3, 5),
        new Vec3(-1 + 3, 1 + 3, 5),
        new Vec3(-1 + 3, -1 + 3, 3),
        new Vec3(1 + 3, -1 + 3, 3),
        new Vec3(1 + 3, 1 + 3, 3),
        new Vec3(-1 + 3, 1 + 3, 3)
    ];
    const indicies = [
        0, 1, 2,
        0, 3, 2,
        0, 1, 5,
        0, 4, 5,
        0, 3, 7,
        0, 4, 7,
        2, 3, 7,
        2, 6, 7,
        1, 2, 6,
        1, 5, 6,
        4, 5, 6,
        4, 7, 6
    ];
    const util = new Util(4);
    const cam = new Camera(new Vec3(0, 0, -10), 0, 0);
    function setup() {
        ctx.font = "10px Arial";
        canvas.addEventListener("mousedown", function (event) {
            down = true;
            premoveX = cam.angleX;
            premoveY = cam.angleY;
            startX = event.clientX;
            startY = event.clientY;
        });
        canvas.addEventListener("mouseup", () => {
            down = false;
            premoveX = cam.angleX;
            premoveY = cam.angleY;
        });
        canvas.addEventListener("touchstart", function (event) {
            down = true;
            premoveX = cam.angleX;
            premoveY = cam.angleY;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });
        canvas.addEventListener("touchend", () => {
            down = false;
            premoveX = cam.angleX;
            premoveY = cam.angleY;
        });
        canvas.addEventListener("mousemove", function (event) {
            if (down) {
                cam.angleY = premoveY + (event.clientX - startX) / 100;
                cam.angleX = premoveX + (event.clientY - startY) / 100;
            }
        });
        canvas.addEventListener("touchmove", function (event) {
            if (down) {
                cam.angleY = premoveY + (event.touches[0].clientX - startX) / 100;
                cam.angleX = premoveX + (event.touches[0].clientY - startY) / 100;
            }
        });
    }
    function frameUpdate(timestamp) {
        ctx.fillStyle = "rgb(30, 40, 50)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(0, 255, 255)";
        ctx.fillStyle = "rgba(0, 255 , 0, 50)";
        for (var i = 0; i < indicies.length / 3; i++) {
            ctx.beginPath();
            const corner0 = util.vecToCanvas(cube[indicies[i * 3]]);
            const corner1 = util.vecToCanvas(cube[indicies[i * 3 + 1]]);
            const corner2 = util.vecToCanvas(cube[indicies[i * 3 + 2]]);
            ctx.moveTo(corner0.x, corner0.y);
            ctx.lineTo(corner1.x, corner1.y);
            ctx.lineTo(corner2.x, corner2.y);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
        ctx.strokeStyle = "rgb(0, 255, 100)";
        ctx.fillStyle = "rgb(255, 255 ,255)";
        ctx.lineWidth = 1;
        for (var i = 0; i < cube.length; i++) {
            const tempPoint = util.rotX(util.rotY(cube[i], cam.angleY), cam.angleX);
            ctx.beginPath();
            const point2d = util.g2c(util.vecToGrid(tempPoint));
            ctx.arc(point2d.x, point2d.y, 1, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillText(i.toString(), point2d.x, point2d.y);
        }
        ctx.beginPath();
        const zero = util.g2c(new Vec3(0, 0, 0));
        ctx.arc(zero.x, zero.y, 1, 0, Math.PI * 2);
        ctx.stroke();
        window.requestAnimationFrame(frameUpdate);
    }
    setup();
    window.requestAnimationFrame(frameUpdate);
})(camera3d || (camera3d = {}));
