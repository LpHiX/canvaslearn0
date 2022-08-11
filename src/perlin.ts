namespace perlin{
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const debugText = document.getElementById("debugText") as HTMLDivElement;

class Vec2{
    constructor(
        public x: number,
        public y: number
    ){}
    add(other: Vec2): Vec2{
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    mul(scalar: number): Vec2{
        return new Vec2(this.x * scalar, this.y * scalar);
    }
    dot(other: Vec2): number{
        return this.x * other.x + this.y * other.y;
    }
    static randomVec(){
        return new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
}

function lerp(w:number, a:number, b:number): number {
    return a + (b - a) * (w * w * w * ((6 * w - 15) * w + 10));
}

class PerlinLayer{
    corners: Vec2[][] = [];
    constructor(
        public size:number
    ){
        for(var x = 0; x <= size; x++){
            this.corners.push([]);
            for(var y = 0; y <= size; y++){
                this.corners[x].push(Vec2.randomVec());
            }
        }
    }
    value(canvasX: number, canvasY: number): number {
        var normVec = new Vec2(canvasX / canvas.width * this.size, canvasY / canvas.height * this.size);
        var indexVec = new Vec2(Math.floor(normVec.x), Math.floor(normVec.y));
        var fracVec = new Vec2(normVec.x % 1, normVec.y % 1);
        var dot0 = new Vec2(fracVec.x, fracVec.y).dot(this.corners[indexVec.x][indexVec.y]);
        var dot1 = new Vec2(fracVec.x - 1, fracVec.y).dot(this.corners[indexVec.x + 1][indexVec.y]);
        var dot2 = new Vec2(fracVec.x, fracVec.y - 1).dot(this.corners[indexVec.x][indexVec.y + 1]);
        var dot3 = new Vec2(fracVec.x - 1, fracVec.y - 1).dot(this.corners[indexVec.x + 1][indexVec.y + 1]);
        var x0 = lerp(fracVec.x, dot0, dot1);
        var x1 = lerp(fracVec.x, dot2, dot3);
        return lerp(fracVec.y, x0, x1);
    }
}
var layers: PerlinLayer[] = [];

function setup(){
    var id = ctx.createImageData(canvas.width, canvas.height);
    var d = id.data;
    var layer0 = new PerlinLayer(4);
    var max = -10;
    var min = 10;
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            const val = layer0.value(x,y);
            if(val < min){
                min = val;
            }
            if(val > max){
                max = val;
            }
            d[(y * canvas.width + x) * 4] = 0;
            d[(y * canvas.width + x) * 4 + 1] = val * 255;
            d[(y * canvas.width + x) * 4 + 2] = 0;
            d[(y * canvas.width + x) * 4 + 3] = 255;
        }
    }
    debugText.innerText = `
    max = ${max}
    min = ${min}
    `
    ctx.putImageData(id, 0, 0);
    ctx.fillStyle = "rgb(20, 40, 50)";
    ctx.fillRect(0, 0, 20, 30);
}
setup();
}