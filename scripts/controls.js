import { Vec3 } from "./structs.js";
import { rotY } from "./utils.js";
export class Controls {
    constructor(canvas0, canvas1, cam0, cam1) {
        this.canvas0 = canvas0;
        this.canvas1 = canvas1;
        this.cam0 = cam0;
        this.cam1 = cam1;
        this.forward = false;
        this.down = false;
        this.startX = 0;
        this.startY = 0;
        this.premoveY = 0;
        this.premoveX = 0;
        this.wPressed = false;
        this.aPressed = false;
        this.sPressed = false;
        this.dPressed = false;
        this.spacePressed = false;
        this.iPressed = false;
        this.jPressed = false;
        this.kPressed = false;
        this.lPressed = false;
        this.yVel = 0;
    }
    setup() {
        this.canvas0.addEventListener("mousedown", event => {
            this.down = true;
            this.premoveX = this.cam0.eulerRot.x;
            this.premoveY = this.cam0.eulerRot.y;
            this.startX = event.clientX;
            this.startY = event.clientY;
        });
        this.canvas0.addEventListener("mouseup", () => {
            this.down = false;
            this.premoveX = this.cam0.eulerRot.x;
            this.premoveY = this.cam0.eulerRot.y;
        });
        this.canvas0.addEventListener("mousemove", event => {
            if (this.down) {
                this.cam0.eulerRot.y = this.premoveY - (event.clientX - this.startX) / 100;
                this.cam0.eulerRot.x = this.premoveX + (event.clientY - this.startY) / 100;
            }
        });
        this.canvas1.addEventListener("mousedown", event => {
            this.down = true;
            this.premoveX = this.cam1.eulerRot.x;
            this.premoveY = this.cam1.eulerRot.y;
            this.startX = event.clientX;
            this.startY = event.clientY;
        });
        this.canvas1.addEventListener("mouseup", () => {
            this.down = false;
            this.premoveX = this.cam1.eulerRot.x;
            this.premoveY = this.cam1.eulerRot.y;
        });
        this.canvas1.addEventListener("mousemove", event => {
            if (this.down) {
                this.cam1.eulerRot.y = this.premoveY - (event.clientX - this.startX) / 100;
                this.cam1.eulerRot.x = this.premoveX + (event.clientY - this.startY) / 100;
            }
        });
        this.canvas0.addEventListener("touchstart", event => {
            this.down = true;
            this.forward = true;
            this.premoveX = this.cam0.eulerRot.x;
            this.premoveY = this.cam0.eulerRot.y;
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
        });
        this.canvas0.addEventListener("touchend", () => {
            this.down = false;
            this.forward = false;
            this.premoveX = this.cam0.eulerRot.x;
            this.premoveY = this.cam0.eulerRot.y;
        });
        this.canvas0.addEventListener("touchmove", event => {
            if (this.down) {
                this.cam0.eulerRot.y = this.premoveY - (event.touches[0].clientX - this.startX) / 100;
                this.cam0.eulerRot.x = this.premoveX + (event.touches[0].clientY - this.startY) / 100;
            }
        });
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "w":
                    this.wPressed = true;
                    break;
                case "a":
                    this.aPressed = true;
                    break;
                case "s":
                    this.sPressed = true;
                    break;
                case "d":
                    this.dPressed = true;
                    break;
                case " ":
                    this.spacePressed = true;
                    break;
                case "i":
                    this.iPressed = true;
                    break;
                case "j":
                    this.jPressed = true;
                    break;
                case "k":
                    this.kPressed = true;
                    break;
                case "l":
                    this.lPressed = true;
                    break;
                default:
                    break;
            }
            //event.preventDefault();
        });
        document.addEventListener("keyup", event => {
            switch (event.key) {
                case "w":
                    this.wPressed = false;
                    break;
                case "a":
                    this.aPressed = false;
                    break;
                case "s":
                    this.sPressed = false;
                    break;
                case "d":
                    this.dPressed = false;
                    break;
                case " ":
                    this.spacePressed = false;
                    break;
                case "i":
                    this.iPressed = false;
                    break;
                case "j":
                    this.jPressed = false;
                    break;
                case "k":
                    this.kPressed = false;
                    break;
                case "l":
                    this.lPressed = false;
                    break;
                default:
                    break;
            }
            //event.preventDefault();
        });
    }
    updateUser() {
        if (this.wPressed) {
            this.cam0.pos = this.cam0.pos.add(rotY(this.cam0.eulerRot.y, new Vec3(0, 0, 0.1)));
        }
        if (this.aPressed) {
            this.cam0.pos = this.cam0.pos.add(rotY(this.cam0.eulerRot.y, new Vec3(-0.1, 0, 0)));
        }
        if (this.sPressed) {
            this.cam0.pos = this.cam0.pos.add(rotY(this.cam0.eulerRot.y, new Vec3(0, 0, -0.1)));
        }
        if (this.dPressed) {
            this.cam0.pos = this.cam0.pos.add(rotY(this.cam0.eulerRot.y, new Vec3(0.1, 0, 0)));
        }
        if (this.iPressed) {
            this.cam1.pos = this.cam1.pos.add(rotY(this.cam1.eulerRot.y, new Vec3(0, 0, 0.1)));
        }
        if (this.jPressed) {
            this.cam1.pos = this.cam1.pos.add(rotY(this.cam1.eulerRot.y, new Vec3(-0.1, 0, 0)));
        }
        if (this.kPressed) {
            this.cam1.pos = this.cam1.pos.add(rotY(this.cam1.eulerRot.y, new Vec3(0, 0, -0.1)));
        }
        if (this.lPressed) {
            this.cam1.pos = this.cam1.pos.add(rotY(this.cam1.eulerRot.y, new Vec3(0.1, 0, 0)));
        }
        if (this.cam0.pos.y > 0) {
            this.yVel -= 1;
            this.cam0.pos.y += this.yVel / 75;
        }
        else {
            this.cam0.pos.y = 0;
            this.yVel = 0;
            if (this.spacePressed) {
                this.yVel = 20;
                this.cam0.pos.y += 0.1;
            }
        }
        if (this.forward) {
            this.cam0.pos = this.cam0.pos.add(rotY(this.cam0.eulerRot.y, new Vec3(0, 0, 0.1)));
        }
    }
}
