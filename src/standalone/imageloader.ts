namespace imageLoader{
class TextureManager{
    private texMap: Map<Texture, ImageData>;
    constructor(
        public textures: Texture[]
    ){
        this.texMap = new Map<Texture, ImageData>();
    }
    loadTextures(loaded: Iterator, finishedCallback: Function): void{
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
                    this.texMap.set(
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
    getPixel(texture: Texture, u: number, v: number): number[] | undefined{
        const imageData = this.texMap.get(texture);
        if(imageData === undefined) return undefined;
        const index = (Math.round(v * imageData.height) * imageData.width + Math.round(u * imageData.width)) * 4;
        return [imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]];
    }
}

class Texture{
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
class Iterator{
    public value: number;
    constructor(
        public callback: (value:number) => void
    ){
        this.value = 0;
    }
    iterate():void{
        this.value++
        this.callback(this.value);
    }
}
const loadImage = (texture: Texture, iterator: Iterator) => new Promise<LoadedTexture>((resolve, reject) => {
    const loadedTexture = new LoadedTexture( texture, new Image())
    loadedTexture.image.onload = () => {
        iterator.iterate();
        console.log(`${iterator.value} is loaded with source ${texture.src}`);
        
        //const debugWait = Date.now();
        //while(Date.now() - 100 < debugWait) continue;
        
        resolve(loadedTexture)
    };
    loadedTexture.image.onerror = reject;
    loadedTexture.image.crossOrigin = 'anonymous';
    loadedTexture.image.src = texture.src;
});

function main(){
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const debugText = document.getElementById('debugText') as HTMLDivElement;

    const tex0 = new Texture("./images/TXT_uvMap.png");
    const tex1 = new Texture("./images/TXT_uvMap1.png");
    const tex2 = new Texture("./images/TXT_uvMap2.png");
    const tex3 = new Texture("./images/TXT_uvMap3.png");
    const tex4 = new Texture("./images/TXT_uvMap4.png");
    const tex5 = new Texture("http://placekitten.com/85/150");
    const tex6 = new Texture("http://placekitten.com/85/130");
    const tex7 = new Texture("http://placekitten.com/85/110");
    const texMan = new TextureManager([tex0, tex1, tex2, tex3, tex4, tex5, tex6, tex7]);
    
    texMan.loadTextures(new Iterator(value => debugText.innerText = value.toString()), () =>{
        console.log(tex1);
        const testImageData = ctx.createImageData(500, 500);
        for(let x = 0; x < 500; x++){
            for(let y = 0; y < 500; y++){
                const pixelData = texMan.getPixel(tex3, x / 500, y / 500);
                if(pixelData === undefined){
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
}