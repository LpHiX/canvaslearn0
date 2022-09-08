"use strict";
var imageLoader;
(function (imageLoader) {
    class TextureManager {
        textures;
        texMap;
        constructor(textures) {
            this.textures = textures;
            this.texMap = new Map();
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
                        this.texMap.set(imgResult.value.texture, ctx.getImageData(0, 0, imgResult.value.image.width, imgResult.value.image.height));
                    }
                    else {
                        console.log(`${i} could not be loaded`);
                    }
                });
                console.log(`${loaded.value} out of ${this.textures.length} has been loaded`);
                finishedCallback();
            });
        }
        getPixel(texture, u, v) {
            const imageData = this.texMap.get(texture);
            if (imageData === undefined)
                return undefined;
            const index = (Math.round(v * imageData.height) * imageData.width + Math.round(u * imageData.width)) * 4;
            return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
        }
    }
    class Texture {
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
    class Iterator {
        callback;
        value;
        constructor(callback) {
            this.callback = callback;
            this.value = 0;
        }
        iterate() {
            this.value++;
            this.callback(this.value);
        }
    }
    const loadImage = (texture, iterator) => new Promise((resolve, reject) => {
        const loadedTexture = new LoadedTexture(texture, new Image());
        loadedTexture.image.onload = () => {
            iterator.iterate();
            console.log(`${iterator.value} is loaded with source ${texture.src}`);
            //const debugWait = Date.now();
            //while(Date.now() - 100 < debugWait) continue;
            resolve(loadedTexture);
        };
        loadedTexture.image.onerror = reject;
        loadedTexture.image.crossOrigin = 'anonymous';
        loadedTexture.image.src = texture.src;
    });
    function main() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const debugText = document.getElementById('debugText');
        const tex0 = new Texture("./images/TXT_uvMap.png");
        const tex1 = new Texture("./images/TXT_uvMap1.png");
        const tex2 = new Texture("./images/TXT_uvMap2.png");
        const tex3 = new Texture("./images/TXT_uvMap3.png");
        const tex4 = new Texture("./images/TXT_uvMap4.png");
        const tex5 = new Texture("http://placekitten.com/85/150");
        const tex6 = new Texture("http://placekitten.com/85/130");
        const tex7 = new Texture("http://placekitten.com/85/110");
        const texMan = new TextureManager([tex0, tex1, tex2, tex3, tex4, tex5, tex6, tex7]);
        texMan.loadTextures(new Iterator(value => debugText.innerText = value.toString()), () => {
            console.log(tex1);
            const testImageData = ctx.createImageData(500, 500);
            for (let x = 0; x < 500; x++) {
                for (let y = 0; y < 500; y++) {
                    const pixelData = texMan.getPixel(tex3, x / 500, y / 500);
                    if (pixelData === undefined) {
                        continue;
                    }
                    const index = (y * 500 + x) * 4;
                    testImageData.data[index] = pixelData[0];
                    testImageData.data[index + 1] = pixelData[1];
                    testImageData.data[index + 2] = pixelData[2];
                    testImageData.data[index + 3] = 255;
                }
            }
            ctx.putImageData(testImageData, 0, 0);
        });
    }
    main();
})(imageLoader || (imageLoader = {}));
