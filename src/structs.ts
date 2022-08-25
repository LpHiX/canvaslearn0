export class Vec2{
    constructor(
        public x: number,
        public y: number
     ){}
     mul(scalar:number):Vec2{
         return new Vec2(this.x * scalar, this.y * scalar);
     }
}
export class Vec3{
    constructor(
       public x: number,
       public y: number,
       public z: number,
    ){}
    add(other: Vec3): Vec3{
        return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    mul(scalar:number):Vec3{
        return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    static lerp(alpha:number, a:Vec3, b:Vec3){
        return a.add(b.add(a.mul(-1)).mul(alpha));
    }
}
export class Triangle{
    public avgZ: number;
    constructor(
        public vert0: Vec3,
        public vert1: Vec3,
        public vert2: Vec3,
        public wireframe: boolean,
        public fillStyle: string
    ){
        this.avgZ = (vert0.z + vert1.z + vert2.z) / 3;
    }
}

export class Triangle2{
    constructor(
        public vert0: Vec3,
        public vert1: Vec3,
        public vert2: Vec3,
        public wireframe: boolean,
        public fillStyle: string
    ){}
}