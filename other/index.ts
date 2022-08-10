const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

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
        return new Vec2(Math.random() * 2 - 1, Math.random() * 2 - 1)
    }
}

function lerp(alpha:number, a:number, b:number): number {
    return a + (b - a) * alpha;
}

class PerlinLayer{
    corners: Vec2[][] = [];
    constructor(
        public size:number
    ){
        for(var x = 0; x < size; x++){
            this.corners.push([]);
            for(var y = 0; y < size; y++){
                this.corners[x].push(Vec2.randomVec());
            }
        }
    }
    value(canvasX: number, canvasY: number): number {
        var normVec = new Vec2(canvasX / canvas.width * this.size, canvasY / canvas.height * this.size);
        var indexVec = new Vec2(Math.floor(normVec.x), Math.floor(normVec.y));
        var fracVec = new Vec2(normVec.x % 1, normVec.y % 1);
        var dot0 = fracVec.dot(this.corners[indexVec.x][indexVec.y]);
        var dot1 = fracVec.dot(this.corners[indexVec.x + 1][indexVec.y]);
        var dot2 = fracVec.dot(this.corners[indexVec.x][indexVec.y + 1]);
        var dot3 = fracVec.dot(this.corners[indexVec.x + 1][indexVec.y + 1]);
        var x0 = lerp(fracVec.x, dot0, dot1);
        var x1 = lerp(fracVec.x, dot2, dot3);
        return lerp(fracVec.y, x0, x1;)
    }
}


function setup(){
    var id = ctx.createImageData(canvas.width, canvas.height);
    var d = id.data;
    var layer0 = new PerlinLayer(4);
    
}
setup();