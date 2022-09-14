"use strict";
var debug;
(function (debug) {
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = src;
    });
    /*
    class Texture{
        public img: HTMLImageElement;
        public data: Uint8ClampedArray;
        constructor(
            public src:string
        ){
    
            loadImage(src).then(img => this.img = img);
            
        }
    }
    
    loadImage("http://placekitten.com/90/13300/4").then(image =>
      console.log(image, `\nloaded? ${image.complete}`)
    );
    loadImage("http://placekitten.com/90/130").then(image =>
      console.log(image, `\nloaded? ${image.complete}`)
    );
    loadImage("http://placekitten.com/90/160").then(image =>
      console.log(image, `\nloaded? ${image.complete}`)
    );
    loadImage("http://placekitten.com/90/13300/4").then(image =>
      console.log(image, `\nloaded? ${image.complete}`)
    );*/
    const imageUrls = [
        "http://placekitten.com/85/150",
        "http://placekitten.com/85/130",
        "http://placekitten.com/85/110",
        "./images/TXT_uvMap.png",
        "./images/TXT_uvMap1.png",
        "./images/TXT_uvMap2.png",
        "./images/TXT_uvMap3.png",
        "./images/TXT_uvMap4.png",
    ];
    Promise.allSettled(imageUrls.map(loadImage)).then(images => {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        images.forEach((image, i) => {
            if (image.status === 'fulfilled') {
                ctx.drawImage(image.value, i * 90, 0, image.value.width, image.value.height);
                const data = ctx.getImageData(i * 90, 0, image.value.width, image.value.height);
                console.log(`${i} loaded`);
            }
            else {
                console.log(`${i} has not loaded`);
            }
        });
        console.log("Loading has completed");
    });
})(debug || (debug = {}));
