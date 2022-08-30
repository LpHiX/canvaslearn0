"use strict";
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
const testImg = document.getElementById("testImg");
const debugText = document.getElementById("debugText");
var imageData = context.createImageData(canvas.width, canvas.height);
var data = imageData.data;
var test = document.createElement("canvas");
test.width = testImg.naturalWidth;
test.height = testImg.naturalHeight;
//document.body.appendChild(test);
test.style.borderStyle = "solid";
test.style.borderWidth = "1px";
var cont = test.getContext("2d");
cont.drawImage(testImg, 0, 0);
const testImageData = cont.getImageData(0, 0, testImg.naturalWidth, testImg.naturalHeight);
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `Vec2(${this.x},${this.y})`;
    }
}
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return `Vec2(${this.x},${this.y}, ${this.z})`;
    }
}
const tVec0 = new Vec2(50, 800);
const tVec1 = new Vec2(200, 500);
const tVec2 = new Vec2(950, 50);
function changePixel(x, y, red, green, blue, alpha) {
    data[(y * imageData.width + x) * 4] = red;
    data[(y * imageData.width + x) * 4 + 1] = green;
    data[(y * imageData.width + x) * 4 + 2] = blue;
    data[(y * imageData.width + x) * 4 + 3] = alpha;
}
function drawLine(verts) {
    var slope = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    if (slope < 1 && slope > -1) {
        if (verts[0].x > verts[1].x) {
            verts = [verts[1], verts[0]];
        }
        var deltaY = 0.5;
        for (let x = verts[0].x; x <= verts[1].x; x++) {
            changePixel(x, verts[0].y + Math.floor(deltaY), 200, 0, 100, 255);
            deltaY += slope;
        }
    }
    else {
        if (verts[0].y > verts[1].y) {
            verts = [verts[1], verts[0]];
        }
        slope = 1 / slope;
        var deltaX = 0.5;
        for (let y = verts[0].y; y <= verts[1].y; y++) {
            changePixel(verts[0].x + Math.floor(deltaX), y, 100, 0, 100, 255);
            deltaX += slope;
        }
    }
    changePixel(verts[0].x, verts[0].y, 0, 0, 0, 255);
    changePixel(verts[1].x, verts[1].y, 0, 0, 0, 255);
}
function drawTriangle(verts) {
    verts.sort((a, b) => a.x - b.x);
    const slope0 = (verts[2].y - verts[0].y) / (verts[2].x - verts[0].x);
    const slope1 = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    const slope2 = (verts[2].y - verts[1].y) / (verts[2].x - verts[1].x);
    var delta0 = 0.5;
    var delta1 = 0.5;
    var delta2 = 0.5;
    for (let x = verts[0].x; x < verts[1].x; x++) {
        var yValues = [verts[0].y + Math.floor(delta0), verts[0].y + Math.floor(delta1)].sort((a, b) => a - b);
        for (let y = yValues[0]; y <= yValues[1]; y++) {
            changePixel(x, y, 20, 255, 100, 255);
        }
        changePixel(x, verts[0].y + Math.floor(delta0), 20, 255, 100, 255);
        changePixel(x, verts[0].y + Math.floor(delta1), 20, 0, 255, 255);
        delta0 += slope0;
        delta1 += slope1;
    }
    for (let x = verts[1].x; x <= verts[2].x; x++) {
        var yValues = [verts[0].y + Math.floor(delta0), verts[1].y + Math.floor(delta2)].sort((a, b) => a - b);
        for (let y = yValues[0]; y <= yValues[1]; y++) {
            changePixel(x, y, y, 255, x, 255);
        }
        changePixel(x, verts[0].y + Math.floor(delta0), 20, 255, 100, 255);
        changePixel(x, verts[1].y + Math.floor(delta2), 20, 0, 255, 255);
        delta0 += slope0;
        delta2 += slope2;
    }
}
function getUV(x0, y0, vert0, vert1, vert2, down) {
    // vert0 - vert1 = a
    // vert1 - vert2 = b
    // inverse matrix to find a and b in terms of x and y
    const determinant = (vert1.x - vert0.x) * (vert2.y - vert1.y) - (vert2.x - vert1.x) * (vert1.y - vert0.y);
    const x = x0 - vert0.x;
    const y = y0 - vert0.y;
    if (down) {
        return new Vec2(1 / determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x)), 1 - 1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x)));
    }
    else {
        return new Vec2(1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x)), 1 - 1 / determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x)));
    }
}
function applyPixel(x, y, vert0, vert1, vert2, down, imageData) {
    const uv = getUV(x, y, vert0, vert1, vert2, down);
    const texData = imageData.data;
    const index = (Math.round(uv.y * imageData.height) * imageData.width + Math.round(uv.x * imageData.width)) * 4;
    changePixel(x, y, texData[index], texData[index + 1], texData[index + 2], 255);
}
function textureTriangle(vert0, vert1, vert2, down, textureImageData) {
    var verts = [vert0, vert1, vert2];
    verts.sort((a, b) => a.x - b.x);
    const slope0 = (verts[2].y - verts[0].y) / (verts[2].x - verts[0].x);
    const slope1 = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    const slope2 = (verts[2].y - verts[1].y) / (verts[2].x - verts[1].x);
    var delta0 = 0.5;
    var delta1 = 0.5;
    var delta2 = 0.5;
    for (let x = verts[0].x; x < verts[1].x; x++) {
        var yValues = [verts[0].y + Math.floor(delta0), verts[0].y + Math.floor(delta1)].sort((a, b) => a - b);
        for (let y = yValues[0]; y <= yValues[1]; y++) {
            applyPixel(x, y, vert0, vert1, vert2, down, textureImageData);
        }
        delta0 += slope0;
        delta1 += slope1;
    }
    for (let x = verts[1].x; x <= verts[2].x; x++) {
        var yValues = [verts[0].y + Math.floor(delta0), verts[1].y + Math.floor(delta2)].sort((a, b) => a - b);
        for (let y = yValues[0]; y <= yValues[1]; y++) {
            applyPixel(x, y, vert0, vert1, vert2, down, textureImageData);
        }
        delta0 += slope0;
        delta2 += slope2;
    }
}
function main() {
    canvas.addEventListener("mousedown", event => {
        const uv = getUV(event.clientX - rect.left, event.clientY - rect.top, tVec0, tVec1, tVec2, false);
        const index = (Math.round(uv.y * testImageData.height) * testImageData.width + Math.round(uv.x * testImageData.width)) * 4;
        debugText.innerText = `${uv.toString()}
        ${Math.round(uv.y * testImageData.height)} ${Math.round(uv.x * testImageData.width)}
        ${testImageData.data[index]} ${testImageData.data[index + 1]} ${testImageData.data[index + 2]}`;
    });
    drawLine([new Vec2(5, 70), new Vec2(2, 60)]);
    //drawTriangle([new Vec2(50, 50), new Vec2(950, 50), new Vec2(50, 950)])
    //drawTriangle([tVec0, tVec1, tVec2])
    textureTriangle(new Vec2(50, 800), new Vec2(700, 950), new Vec2(950, 50), true, testImageData);
    textureTriangle(tVec0, tVec1, tVec2, false, testImageData);
    context.putImageData(imageData, 0, 0);
}
main();
