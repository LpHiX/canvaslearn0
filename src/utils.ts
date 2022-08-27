import {Vec3} from "./structs.js"

export function rotZ(angle:number, coord:Vec3):Vec3{
    return new Vec3(coord.x * Math.cos(angle) - coord.y * Math.sin(angle), coord.x * Math.sin(angle) + coord.y * Math.cos(angle), coord.z);
}
export function rotX(angle:number, coord:Vec3):Vec3{
    return new Vec3(coord.x, coord.y * Math.cos(angle) - coord.z * Math.sin(angle), coord.y * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotY(angle:number, coord:Vec3):Vec3{
    return new Vec3(coord.x * Math.cos(angle) - coord.z * Math.sin(angle), coord.y, coord.x * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotYXZ(angles: Vec3, coord:Vec3):Vec3{
    return rotY(angles.y, rotX(angles.x, rotZ(angles.z, coord)));
}
export function rotZXY(angles: Vec3, coord:Vec3):Vec3{
    return rotZ(angles.z, rotX(angles.x, rotY(angles.y, coord)));
}