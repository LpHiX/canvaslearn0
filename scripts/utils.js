import { Vec3 } from "./structs.js";
export function rotZ(angle, coord) {
    return new Vec3(coord.x * Math.cos(angle) - coord.y * Math.sin(angle), coord.x * Math.sin(angle) + coord.y * Math.cos(angle), coord.z);
}
export function rotX(angle, coord) {
    return new Vec3(coord.x, coord.y * Math.cos(angle) - coord.z * Math.sin(angle), coord.y * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotY(angle, coord) {
    return new Vec3(coord.x * Math.cos(angle) - coord.z * Math.sin(angle), coord.y, coord.x * Math.sin(angle) + coord.z * Math.cos(angle));
}
export function rotYXZ(angles, coord) {
    return rotY(angles.y, rotX(angles.x, rotZ(angles.z, coord)));
}
export function rotZXY(angles, coord) {
    return rotZ(angles.z, rotX(angles.x, rotY(angles.y, coord)));
}
