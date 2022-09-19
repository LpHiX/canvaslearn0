import { Vec3 } from "./structs.js";
export class Rasterizer {
    canvas;
    texMan;
    ctx;
    constructor(canvas, texMan) {
        this.canvas = canvas;
        this.texMan = texMan;
        this.ctx = canvas.getContext("2d");
    }
    canvasVec(vec) {
        const width = 512;
        const height = 512;
        const sizeX = 1;
        const sizeY = 1;
        const canvasMin = 512;
        return new Vec3(width / 2 + vec.x / sizeX * canvasMin / 2, height / 2 - vec.y / sizeY * canvasMin / 2, vec.z);
    }
    drawAllTriangles(triangles) {
        var id = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        var data = id.data;
        function changePixel(uv, color) {
            const index = (uv.y * id.width + uv.x) * 4;
            data[index] = color.x;
            data[index + 1] = color.y;
            data[index + 2] = color.z;
            data[index + 3] = 255;
        }
        triangles.forEach(triangle => {
            var vert0 = triangle.vert0;
            var vert1 = triangle.vert1;
            var vert2 = triangle.vert2;
            vert0.uv = vert0.uv.mul(1 / vert0.pos.z);
            vert1.uv = vert1.uv.mul(1 / vert1.pos.z);
            vert2.uv = vert2.uv.mul(1 / vert2.pos.z);
            vert0.pos = vert0.pos.mul(1 / vert0.pos.z);
            vert1.pos = vert1.pos.mul(1 / vert1.pos.z);
            vert2.pos = vert2.pos.mul(1 / vert2.pos.z);
            var rawVerts = [vert0, vert1, vert2].sort((a, b) => b.pos.y - a.pos.y);
            var verts = [this.canvasVec(rawVerts[0].pos), this.canvasVec(rawVerts[1].pos), this.canvasVec(rawVerts[2].pos)];
            const dLine0 = verts[2].add(verts[0].mul(-1));
            const dLine1 = verts[1].add(verts[0].mul(-1));
            const dLine2 = verts[2].add(verts[1].mul(-1));
            var delta0 = 0.5;
            var delta1 = 0.5;
            var delta2 = 0.5;
            //console.log(verts)
            for (let y = Math.round(verts[0].y); y < Math.round(verts[1].y); y++) {
                let xValues = [Math.round(verts[0].x) + Math.floor(delta0), Math.round(verts[0].x) + Math.floor(delta1)];
                let lineUV = [Vec3.lerp((y - verts[0].y) / (verts[2].y - verts[0].y), rawVerts[0].uv, rawVerts[2].uv), Vec3.lerp((y - verts[0].y) / (verts[1].y - verts[0].y), rawVerts[0].uv, rawVerts[1].uv)];
                if (xValues[0] > xValues[1]) {
                    xValues = [xValues[1], xValues[0]];
                    lineUV = [lineUV[1], lineUV[0]];
                }
                for (let x = xValues[0]; x <= xValues[1]; x++) {
                    const uv = Vec3.lerp((x - xValues[0]) / (xValues[1] - xValues[0]), lineUV[0], lineUV[1]);
                    changePixel(new Vec3(x, y, 0), this.texMan.getPixel(triangle.texture, uv.mul(1 / uv.z)));
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
                    changePixel(new Vec3(x, y, 0), this.texMan.getPixel(triangle.texture, uv.mul(1 / uv.z)));
                }
                delta0 += dLine0.x / dLine0.y;
                delta2 += dLine2.x / dLine2.y;
            }
        });
        this.ctx.putImageData(id, 0, 0);
    }
}
