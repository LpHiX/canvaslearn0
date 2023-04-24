import { Camera, Viewport } from "./camera.js";
import { World } from "./world.js";
import { Vec3 } from "./structs.js";
import { LoadCounter, Texture, TextureManager } from "./textureloader.js";
import { Cube, Torus } from "./object3d.js";
const canvas0 = document.getElementById("canvas0");
const ctx = canvas0.getContext("2d");
const cam0 = new Camera(new Vec3(0, 0, 0), new Vec3(0, 0, 0), 1, 1, 0.1);
const texMan = new TextureManager();
const viewport0 = new Viewport(canvas0, cam0, texMan);
const debugText = document.getElementById('debugText');
const fpsMeter = document.getElementById('fpsMeter');
const tex0 = new Texture("http://placekitten.com/85/150");
const tex1 = new Texture("http://placekitten.com/85/130");
const tex2 = new Texture("http://placekitten.com/85/110");
const tex3 = new Texture("./images/TXT_uvMap0.png");
const grassTop = new Texture("./textures/grassTop.webp");
const grassTexture = new Texture("./textures/grassTexture.webp");
const stoneTexture = new Texture("./textures/stoneTexture.webp");
var testBlock0 = new Cube(new Vec3(0.7, -0.7, 2), grassTexture);
var testBlock1 = new Cube(new Vec3(-0.5, 1, 4), stoneTexture);
var testBlock2 = new Cube(new Vec3(3, 2, 5), tex0);
var testBlock3 = new Cube(new Vec3(-1.2, -0.3, 3), tex3);
var testTorus = new Torus(new Vec3(-3, 2, 6), new Vec3(1, 1, 1), 1, 0.5, new Vec3(10, 20, 0), tex0);
//testBlock.eulerRot = new Vec3(0, 0.6, 0);
var world0 = new World([testBlock0, testBlock1, testBlock2, testBlock3, testTorus]);
function setup() {
    texMan.textures = [tex0, tex1, tex2, grassTop, grassTexture, tex3, stoneTexture];
    texMan.loadTextures(new LoadCounter(value => debugText.innerText = value.toString()), () => {
        const testImageData = ctx.createImageData(500, 500);
        for (let x = 0; x < 500; x++) {
            for (let y = 0; y < 500; y++) {
                const pixelData = texMan.getPixel(grassTexture, new Vec3(x / 500, y / 500, 1));
                if (pixelData === undefined) {
                    continue;
                }
                const index = (y * 500 + x) * 4;
                testImageData.data[index] = pixelData.x;
                testImageData.data[index + 1] = pixelData.y;
                testImageData.data[index + 2] = pixelData.z;
                testImageData.data[index + 3] = 255;
            }
        }
        ctx.putImageData(testImageData, 0, 0);
    });
    requestAnimationFrame(mainLoop);
}
var test = 0;
function mainLoop(timestamp) {
    testBlock0.eulerRot = testBlock0.eulerRot.add(new Vec3(0.01, 0.003, 0.001));
    testBlock1.eulerRot = testBlock1.eulerRot.add(new Vec3(-0.001, 0.001, 0.002));
    testBlock2.eulerRot = testBlock2.eulerRot.add(new Vec3(-0.04, -0.01, -0.02));
    testBlock3.eulerRot = testBlock3.eulerRot.add(new Vec3(-0.02, -0.001, 0.002));
    testTorus.eulerRot = testTorus.eulerRot.add(new Vec3(-0.02, -0.001, 0.002));
    viewport0.drawWorld(world0);
    fpsMeter.innerText = (performance.now() - timestamp).toString();
    requestAnimationFrame(mainLoop);
}
setup();
