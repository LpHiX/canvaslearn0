"use strict";
var trianglerasterizer;
(function (trianglerasterizer) {
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
    class Vec3 {
        x;
        y;
        z;
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
    class Vertex {
        pos;
        uv;
        constructor(pos, uv) {
            this.pos = pos;
            this.uv = uv;
        }
    }
    class Grid {
        size;
        constructor(size) {
            this.size = size;
        }
        canvasX(vec) {
            return (1 + vec.x / this.size) * canvas.width / 2;
        }
        canvasY(vec) {
            return (1 - vec.y / this.size) * canvas.height / 2;
        }
        canvasVec(vert) {
            return new Vertex(new Vec3(this.canvasX(vert.pos), this.canvasY(vert.pos), vert.pos.z), vert.uv);
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
    function getColor(uv, texture) {
        const index = (Math.round(uv.y / uv.z * texture.height) * texture.width + Math.round(uv.x / uv.z * texture.width)) * 4;
        return new Vec3(texture.data[index], texture.data[index + 1], texture.data[index + 2]);
    }
    function drawTriangle(vert0, vert1, vert2, texture) {
        vert0.uv = vert0.uv.mul(1 / vert0.pos.z);
        vert1.uv = vert1.uv.mul(1 / vert1.pos.z);
        vert2.uv = vert2.uv.mul(1 / vert2.pos.z);
        vert0.pos = vert0.pos.mul(1 / vert0.pos.z);
        vert1.pos = vert1.pos.mul(1 / vert1.pos.z);
        vert2.pos = vert2.pos.mul(1 / vert2.pos.z);
        var rawVerts = [vert0, vert1, vert2].sort((a, b) => b.pos.y - a.pos.y);
        var verts = [grid.canvasVec(rawVerts[0]).pos, grid.canvasVec(rawVerts[1]).pos, grid.canvasVec(rawVerts[2]).pos];
        const dLine0 = verts[2].add(verts[0].mul(-1));
        const dLine1 = verts[1].add(verts[0].mul(-1));
        const dLine2 = verts[2].add(verts[1].mul(-1));
        var delta0 = 0.5;
        var delta1 = 0.5;
        var delta2 = 0.5;
        console.log(verts);
        for (let y = Math.round(verts[0].y); y < Math.round(verts[1].y); y++) {
            let xValues = [Math.round(verts[0].x) + Math.floor(delta0), Math.round(verts[0].x) + Math.floor(delta1)];
            let lineUV = [Vec3.lerp((y - verts[0].y) / (verts[2].y - verts[0].y), rawVerts[0].uv, rawVerts[2].uv), Vec3.lerp((y - verts[0].y) / (verts[1].y - verts[0].y), rawVerts[0].uv, rawVerts[1].uv)];
            if (xValues[0] > xValues[1]) {
                xValues = [xValues[1], xValues[0]];
                lineUV = [lineUV[1], lineUV[0]];
            }
            for (let x = xValues[0]; x <= xValues[1]; x++) {
                const uv = Vec3.lerp((x - xValues[0]) / (xValues[1] - xValues[0]), lineUV[0], lineUV[1]);
                changePixel(new Vec3(x, y, 0), getColor(uv, testImageData));
            }
            delta0 += dLine0.x / dLine0.y;
            delta1 += dLine1.x / dLine1.y;
        }
        for (let y = Math.round(verts[1].y); y < Math.round(verts[2].y); y++) {
            let xValues = [Math.round(verts[0].x) + Math.floor(delta0), Math.round(verts[1].x) + Math.floor(delta2)];
            let lineUV = [Vec3.lerp((y - verts[0].y) / (verts[2].y - verts[0].y), rawVerts[0].uv, rawVerts[2].uv), Vec3.lerp((y - verts[1].y) / (verts[2].y - verts[1].y), rawVerts[1].uv, rawVerts[2].uv)];
            if (xValues[0] > xValues[1]) {
                xValues = [xValues[1], xValues[0]];
                lineUV = [lineUV[1], lineUV[0]];
            }
            for (let x = xValues[0]; x <= xValues[1]; x++) {
                const uv = Vec3.lerp((x - xValues[0]) / (xValues[1] - xValues[0]), lineUV[0], lineUV[1]);
                changePixel(new Vec3(x, y, 0), getColor(uv, testImageData));
            }
            delta0 += dLine0.x / dLine0.y;
            delta2 += dLine2.x / dLine2.y;
        }
    }
    function main() {
        const tVert0 = new Vertex(new Vec3(-10, 10, 25), new Vec3(0, 0, 1));
        const tVert1 = new Vertex(new Vec3(10, 10, 15), new Vec3(1, 0, 1));
        const tVert2 = new Vertex(new Vec3(10, -10, 12), new Vec3(1, 1, 1));
        canvas.addEventListener("mousedown", event => {
        });
        drawTriangle(tVert0, tVert1, tVert2, testImageData);
        drawTriangle(tVert0, new Vertex(new Vec3(-10, -10, 20), new Vec3(0, 1, 1)), tVert2, testImageData);
        //drawTriangle(tVec0, new Vec3(0, 10, 30), tVec2, false, testImageData);
        context.putImageData(imageData, 0, 0);
    }
    main();
})(trianglerasterizer || (trianglerasterizer = {}));
