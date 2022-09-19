import { Vec3 } from "./structs.js";
export class Texture {
    src;
    constructor(src) {
        this.src = src;
    }
}
class LoadedTexture {
    texture;
    image;
    constructor(texture, image) {
        this.texture = texture;
        this.image = image;
    }
}
export class LoadCounter {
    callback;
    value;
    constructor(callback) {
        this.callback = callback;
        this.value = 0;
    }
    count() {
        this.value++;
        this.callback(this.value);
    }
}
const loadImage = (texture, loadCounter) => new Promise((resolve, reject) => {
    const loadedTexture = new LoadedTexture(texture, new Image());
    loadedTexture.image.onload = () => {
        loadCounter.count();
        console.log(`${loadCounter.value}:from ${texture.src}`);
        //const debugWait = Date.now();
        //while(Date.now() - 100 < debugWait) continue;
        resolve(loadedTexture);
    };
    loadedTexture.image.onerror = reject;
    loadedTexture.image.crossOrigin = 'anonymous';
    loadedTexture.image.src = texture.src;
});
export class TextureManager {
    textures;
    textureMap;
    constructor() {
        this.textures = [];
        this.textureMap = new Map();
    }
    loadTextures(loaded, finishedCallback) {
        console.log(`${this.textures.length} textures to be loaded`);
        Promise.allSettled(this.textures.map(texture => loadImage(texture, loaded))).then(images => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            //document.body.appendChild(canvas);
            const ctx = canvas.getContext("2d");
            images.forEach((imgResult, i) => {
                if (imgResult.status === "fulfilled") {
                    ctx.drawImage(imgResult.value.image, 0, 0);
                    this.textureMap.set(imgResult.value.texture, ctx.getImageData(0, 0, imgResult.value.image.width, imgResult.value.image.height));
                }
                else {
                    console.log(`${i} could not be loaded`);
                }
            });
            console.log(`${loaded.value} out of ${this.textures.length} has been loaded`);
            finishedCallback();
        });
    }
    getPixel(texture, uv) {
        const imageData = this.textureMap.get(texture);
        if (imageData === undefined)
            return new Vec3(255, 0, 255);
        const index = (Math.round(uv.y * imageData.height - 0.5) * imageData.width + Math.round(uv.x * imageData.width - 0.5)) * 4;
        return new Vec3(imageData.data[index], imageData.data[index + 1], imageData.data[index + 2]);
    }
}
