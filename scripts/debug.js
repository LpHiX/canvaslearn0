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
function lerp(alpha, a, b) {
    return a + (b - a) * alpha;
}
/*class Vec2{
    constructor(
        public x: number,
        public y: number
    ){}
    toString(){
        return `Vec2(x: ${this.x}, y: ${this.y})`;
    }
}

const tVec0 = new Vec2(50, 800);
const tVec1 = new Vec2(200, 500);
const tVec2 = new Vec2(950, 50);

function changePixel(x: number, y: number, red: number, green: number, blue: number, alpha: number): void {
    data[(y * imageData.width + x) * 4] = red;
    data[(y * imageData.width + x) * 4 + 1] = green;
    data[(y * imageData.width + x) * 4 + 2] = blue;
    data[(y * imageData.width + x) * 4 + 3] = alpha;
}
function drawLine(verts: Vec2[]):void {
    var slope = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    if(slope < 1 && slope > -1){
        if(verts[0].x > verts[1].x){
            verts = [verts[1], verts[0]];
        }
        var deltaY = 0.5;
        for(let x = verts[0].x; x <= verts[1].x; x++){
            changePixel(x, verts[0].y + Math.floor(deltaY), 200, 0, 100, 255);
            deltaY += slope;
        }
    } else{
        if(verts[0].y > verts[1].y){
            verts = [verts[1], verts[0]];
        }
        slope = 1 / slope;
        var deltaX = 0.5;
        for(let y = verts[0].y; y <= verts[1].y; y++){
            changePixel(verts[0].x + Math.floor(deltaX), y, 100, 0, 100, 255);
            deltaX += slope;
        }
    }
    changePixel(verts[0].x, verts[0].y, 0, 0, 0, 255);
    changePixel(verts[1].x, verts[1].y, 0, 0, 0, 255);
}


function drawTriangle(verts: Vec2[]): void{
    verts.sort((a, b) => a.x - b.x);
    const slope0 = (verts[2].y - verts[0].y) / (verts[2].x - verts[0].x);
    const slope1 = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    const slope2 = (verts[2].y - verts[1].y) / (verts[2].x - verts[1].x);
    
    var delta0 = 0.5;
    var delta1 = 0.5;
    var delta2 = 0.5;

    for(let x = verts[0].x; x < verts[1].x; x++){
        var yValues = [verts[0].y + Math.floor(delta0), verts[0].y + Math.floor(delta1)].sort((a, b) => a - b);
        for(let y = yValues[0]; y <= yValues[1]; y++){
            changePixel(x, y, 20, 255, 100, 255);
        }
        changePixel(x, verts[0].y + Math.floor(delta0), 20, 255, 100, 255);
        changePixel(x, verts[0].y + Math.floor(delta1), 20, 0, 255, 255);
        delta0 += slope0;
        delta1 += slope1;
    }
    for(let x = verts[1].x; x <= verts[2].x; x++){
        var yValues = [verts[0].y + Math.floor(delta0), verts[1].y + Math.floor(delta2)].sort((a, b) => a - b);
        for(let y = yValues[0]; y <= yValues[1]; y++){
            changePixel(x, y, y, 255, x, 255);
        }
        changePixel(x, verts[0].y + Math.floor(delta0), 20, 255, 100, 255);
        changePixel(x, verts[1].y + Math.floor(delta2), 20, 0, 255, 255);
        delta0 += slope0;
        delta2 += slope2;
    }
}

function getUV(x0: number, y0: number, vert0: Vec2, vert1: Vec2, vert2: Vec2, down: boolean): Vec2{
    // vert0 - vert1 = a
    // vert1 - vert2 = b
    // inverse matrix to find a and b in terms of x and y
    const determinant = (vert1.x - vert0.x) * (vert2.y - vert1.y) - (vert2.x - vert1.x) * (vert1.y - vert0.y);
    const x = x0 - vert0.x;
    const y = y0 - vert0.y;
    if(down){
        return new Vec2(
            1 / determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x)),
            1 -  1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x))
        );
    } else{
        return new Vec2(
            1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x)),
            1 - 1/ determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x))
        );
    }
}

function applyPixel(x:number, y:number, vert0: Vec2, vert1: Vec2, vert2: Vec2, down: boolean, imageData: ImageData){
    const uv = getUV(x, y, vert0, vert1, vert2, down)
    const texData = imageData.data;
    const index = (Math.round(uv.y * imageData.height) * imageData.width + Math.round(uv.x * imageData.width)) * 4;
        changePixel(x, y, texData[index], texData[index + 1], texData[index + 2], 255);
}


function textureTriangle(vert0: Vec2, vert1: Vec2, vert2: Vec2, down: boolean, textureImageData:ImageData): void {
    var verts= [vert0, vert1, vert2];
    verts.sort((a, b) => a.x - b.x);
    const slope0 = (verts[2].y - verts[0].y) / (verts[2].x - verts[0].x);
    const slope1 = (verts[1].y - verts[0].y) / (verts[1].x - verts[0].x);
    const slope2 = (verts[2].y - verts[1].y) / (verts[2].x - verts[1].x);
    
    var delta0 = 0.5;
    var delta1 = 0.5;
    var delta2 = 0.5;

    for(let x = verts[0].x; x < verts[1].x; x++){
        var yValues = [verts[0].y + Math.floor(delta0), verts[0].y + Math.floor(delta1)].sort((a, b) => a - b);
        for(let y = yValues[0]; y <= yValues[1]; y++){
            applyPixel(x, y, vert0, vert1, vert2, down, textureImageData);
        }
        delta0 += slope0;
        delta1 += slope1;
    }
    for(let x = verts[1].x; x <= verts[2].x; x++){
        var yValues = [verts[0].y + Math.floor(delta0), verts[1].y + Math.floor(delta2)].sort((a, b) => a - b);
        for(let y = yValues[0]; y <= yValues[1]; y++){
            applyPixel(x, y, vert0, vert1, vert2, down, textureImageData);
        }
        delta0 += slope0;
        delta2 += slope2;
    }
}

function main(): void {
    canvas.addEventListener("mousedown", event => {
        const uv = getUV(event.clientX - rect.left, event.clientY - rect.top, tVec0, tVec1, tVec2, false);
        const index = (Math.round(uv.y * testImageData.height) * testImageData.width + Math.round(uv.x * testImageData.width)) * 4;
        debugText.innerText = `${uv.toString()}
        ${Math.round(uv.y * testImageData.height)} ${Math.round(uv.x * testImageData.width)}
        ${testImageData.data[index]} ${testImageData.data[index + 1]} ${testImageData.data[index + 2]}`;
    })
    drawLine([new Vec2(5, 70), new Vec2(2, 60)]);
    //drawTriangle([new Vec2(50, 50), new Vec2(950, 50), new Vec2(50, 950)])
    //drawTriangle([tVec0, tVec1, tVec2])
    textureTriangle(new Vec2(50, 800), new Vec2(700, 950), new Vec2(950, 50), true, testImageData);
    textureTriangle(tVec0, tVec1, tVec2, false, testImageData);
    context.putImageData(imageData, 0, 0,);
}
main();
*/
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    toString() {
        return `Vec3(${this.x}, ${this.y}, ${this.z})`;
    }
    add(vec) {
        return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    mul(scalar) {
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    static lerp(alpha, a, b) {
        return a.add(b.add(a.mul(-1)).mul(alpha));
    }
}
class Grid {
    constructor(size) {
        this.size = size;
    }
    canvasX(vec) {
        return (1 + vec.x / this.size) * canvas.width / 2;
    }
    canvasY(vec) {
        return (1 - vec.y / this.size) * canvas.height / 2;
    }
    canvasVec(vec) {
        return new Vec3(this.canvasX(vec), this.canvasY(vec), vec.z);
    }
}
function changePixel(vec, color) {
    const index = (vec.y * canvas.width + vec.x) * 4;
    data[index] = color.x;
    data[index + 1] = color.y;
    data[index + 2] = color.z;
    data[index + 3] = 255;
}
const grid = new Grid(1);
// Takes verts in form u/z, v/z, 1/z
function getAB(x0, y0, vert0, vert1, vert2, down) {
    // vert0 - vert1 = a
    // vert1 - vert2 = b
    // inverse matrix to find a and b in terms of x and y
    vert0 = grid.canvasVec(vert0);
    vert1 = grid.canvasVec(vert1);
    vert2 = grid.canvasVec(vert2);
    const determinant = (vert1.x - vert0.x) * (vert2.y - vert1.y) - (vert2.x - vert1.x) * (vert1.y - vert0.y);
    const x = x0 - vert0.x;
    const y = y0 - vert0.y;
    if (down) {
        return new Vec3(1 / determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x)), 1 - 1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x)), 0);
    }
    else {
        return new Vec3(1 / determinant * (x * (vert0.y - vert1.y) + y * (vert1.x - vert0.x)), 1 - 1 / determinant * (x * (vert2.y - vert1.y) + y * (vert1.x - vert2.x)), 0);
    }
}
// Takes verts in form u/z, v/z, 1/z
function getColor(uv, down, texture) {
    const index = (Math.round(uv.y / 1 * texture.height) * texture.width + Math.round(uv.x / 1 * texture.width)) * 4;
    return new Vec3(texture.data[index], texture.data[index + 1], texture.data[index + 2]);
}
function drawTriangle(vert0, vert1, vert2, down, texture) {
    vert0 = new Vec3(vert0.x / vert0.z, vert0.y / vert0.z, 1 / vert0.z);
    vert1 = new Vec3(vert1.x / vert1.z, vert1.y / vert1.z, 1 / vert1.z);
    vert2 = new Vec3(vert2.x / vert2.z, vert2.y / vert2.z, 1 / vert2.z);
    const uv0 = new Vec3(1, 0, 1).mul(1);
    const uv1 = new Vec3(0, 1, 1).mul(1);
    const uv2 = new Vec3(1, 1, 1).mul(1);
    var rawVerts = [vert0, vert1, vert2].sort((a, b) => b.y - a.y);
    var verts = [grid.canvasVec(rawVerts[0]), grid.canvasVec(rawVerts[1]), grid.canvasVec(rawVerts[2])];
    const dLine0 = verts[2].add(verts[0].mul(-1));
    const dLine1 = verts[1].add(verts[0].mul(-1));
    const dLine2 = verts[2].add(verts[1].mul(-1));
    const dUV0 = uv2.add(uv0.mul(-1));
    const dUV1 = uv1.add(uv0.mul(-1));
    const dUV2 = uv2.add(uv1.mul(-1));
    var delta0 = 0.5;
    var delta1 = 0.5;
    var delta2 = 0.5;
    console.log(verts);
    for (let y = Math.round(verts[0].y); y < Math.round(verts[1].y); y++) {
        let xValues = [Math.round(verts[0].x) + Math.floor(delta0), Math.round(verts[0].x) + Math.floor(delta1)];
        let lineUV = [Vec3.lerp((y - verts[0].y) / (verts[2].y - verts[0].y), uv0, uv1), Vec3.lerp((y - verts[0].y) / (verts[1].y - verts[0].y), uv0, uv2)];
        if (xValues[0] > xValues[1]) {
            xValues = [xValues[1], xValues[0]];
            lineUV = [lineUV[1], lineUV[0]];
        }
        for (let x = xValues[0]; x <= xValues[1]; x++) {
            const uv = Vec3.lerp((x - xValues[0]) / (xValues[1] - xValues[0]), lineUV[0], lineUV[1]);
            changePixel(new Vec3(x, y, 0), getColor(uv, down, testImageData));
        }
        delta0 += dLine0.x / dLine0.y;
        delta1 += dLine1.x / dLine1.y;
    }
    for (let y = Math.round(verts[1].y); y < Math.round(verts[2].y); y++) {
        let xValues = [Math.round(verts[0].x) + Math.floor(delta0), Math.round(verts[1].x) + Math.floor(delta2)];
        let lineUV = [Vec3.lerp((y - verts[0].y) / (verts[2].y - verts[0].y), uv0, uv2), Vec3.lerp((y - verts[1].y) / (verts[2].y - verts[1].y), uv1, uv2)];
        if (xValues[0] > xValues[1]) {
            xValues = [xValues[1], xValues[0]];
            lineUV = [lineUV[1], lineUV[0]];
        }
        for (let x = xValues[0]; x <= xValues[1]; x++) {
            const uv = Vec3.lerp((x - xValues[0]) / (xValues[1] - xValues[0]), lineUV[0], lineUV[1]);
            changePixel(new Vec3(x, y, 0), getColor(uv, down, testImageData));
        }
        delta0 += dLine0.x / dLine0.y;
        delta2 += dLine2.x / dLine2.y;
    }
}
function divZ(vec) {
    return new Vec3(vec.x / vec.z, vec.y / vec.z, 1 / vec.z);
}
function main() {
    const tVec0 = new Vec3(-10, -10, 25);
    const tVec1 = new Vec3(10, -10, 15);
    const tVec2 = new Vec3(10, 10, 12);
    canvas.addEventListener("mousedown", event => {
        const ab = getAB(event.clientX - rect.left, event.clientY - rect.top, divZ(tVec0), divZ(tVec1), divZ(tVec2), true);
        const u = Vec3.lerp(ab.x, new Vec3(0, 0, divZ(tVec0).z), new Vec3(1 * divZ(tVec1).z, 0, divZ(tVec1).z));
        const v = Vec3.lerp(ab.y, new Vec3(0, 0, divZ(tVec1).z), new Vec3(0, 1 * divZ(tVec2).z, divZ(tVec2).z));
        const index = (Math.round(u.x / u.z * testImageData.height) * testImageData.width + Math.round(v.y / v.z * testImageData.width)) * 4;
        const color = new Vec3(testImageData.data[index], testImageData.data[index + 1], testImageData.data[index + 2]);
        debugText.innerText =
            `AB = ${ab.toString()}
        UV div= (${u.x}, ${v.y})
        UV = (${u.x / u.z}, ${v.y / v.z})
        tex = (${Math.round(u.x / u.z * testImageData.height)}, ${Math.round(v.y / v.z * testImageData.width)}
        color = ${color.toString()}`;
    });
    drawTriangle(tVec0, tVec1, tVec2, true, testImageData);
    //drawTriangle(tVec0, new Vec3(0, 10, 30), tVec2, false, testImageData);
    context.putImageData(imageData, 0, 0);
}
main();
