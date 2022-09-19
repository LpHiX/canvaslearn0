import { Vec3 } from "./structs.js";

export class Texture{
    constructor(
        public src: string
    ){}
}
class LoadedTexture{
    constructor(
        public texture: Texture,
        public image: HTMLImageElement
    ){}
}
export class LoadCounter{
    public value: number;
    constructor(
        public callback: (value:number) => void
    ){
        this.value = 0;
    }
    count():void{
        this.value++
        this.callback(this.value);
    }
}

const loadImage = (texture: Texture, loadCounter: LoadCounter) => new Promise<LoadedTexture>((resolve, reject) => {
    const loadedTexture = new LoadedTexture( texture, new Image())
    loadedTexture.image.onload = () => {
        loadCounter.count();
        console.log(`${loadCounter.value}:from ${texture.src}`);
        
        //const debugWait = Date.now();
        //while(Date.now() - 100 < debugWait) continue;
        
        resolve(loadedTexture)
    };
    loadedTexture.image.onerror = reject;
    loadedTexture.image.crossOrigin = 'anonymous';
    loadedTexture.image.src = texture.src;
});

export class TextureManager{
    public textures: Texture[];
    private textureMap: Map<Texture, ImageData>;
    constructor(
    ){
        this.textures = [];
        this.textureMap = new Map<Texture, ImageData>();
    }
    loadTextures(loaded: LoadCounter, finishedCallback: Function): void{
        console.log(`${this.textures.length} textures to be loaded`)
        Promise.allSettled(this.textures.map(texture => loadImage(texture, loaded))).then(images => {
            const canvas = document.createElement("canvas");
            canvas.width = 1024;
            canvas.height = 1024;
            //document.body.appendChild(canvas);
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            images.forEach((imgResult, i) =>{
                if(imgResult.status === "fulfilled"){
                    ctx.drawImage(imgResult.value.image, 0, 0)
                    this.textureMap.set(
                        imgResult.value.texture, 
                        ctx.getImageData(0, 0, imgResult.value.image.width, imgResult.value.image.height));
                } else{
                    console.log(`${i} could not be loaded`)
                }
            });
            console.log(`${loaded.value} out of ${this.textures.length} has been loaded`)
            finishedCallback();
        })
    }
    getPixel(texture: Texture, uv: Vec3): Vec3{
        const imageData = this.textureMap.get(texture);
        if(imageData === undefined) return new Vec3(255, 0, 255);
        const index = (Math.round(uv.y * imageData.height - 0.5) * imageData.width + Math.round(uv.x * imageData.width - 0.5)) * 4;
        return new Vec3(imageData.data[index], imageData.data[index + 1], imageData.data[index + 2]);
    }
}