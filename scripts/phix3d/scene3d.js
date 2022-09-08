export class Object3D {
    pos;
    eulerRot;
    scale;
    verticies;
    triIndex;
    constructor(pos, eulerRot, scale, verticies, triIndex) {
        this.pos = pos;
        this.eulerRot = eulerRot;
        this.scale = scale;
        this.verticies = verticies;
        this.triIndex = triIndex;
    }
}
export class World {
    objects;
    constructor(objects) {
        this.objects = objects;
    }
}
