import imgSrc from './pic.jpg';
//import imgSrc from './monroe.jpeg';

const DIF = 30;

/*
    [1, 2, 3, 4, 5, 6, 7, 8]
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]
*/

/*
    for (let i = 0; i < len / (DIF * DIF))
*/

const iDataPos = (i, si, h, j, sj, DIF) => (i * DIF + si) * h + j * DIF + sj;
const luminance = (r, g, b, o) => (0.2126 * r + 0.7152 * g + 0.0722 * b) * o / 255;

function stampToPixelArray(imageData, imageWidth, imageHeight) {
    const pixels = [];
    const pw = Math.floor(imageWidth / DIF);
    const ph = Math.floor(imageHeight / DIF);

    let max = 0
    for (let i = 0; i < ph; i++) {
        for (let j = 0; j < pw; j++) {
            let average = 0, pic = [];
            for (let si = 0; si < DIF; si++) {
                for (let sj = 0; sj < DIF; sj++) {
                    const pos = iDataPos(i, si, imageWidth, j, sj, DIF) * 4;
                    const point = imageData.slice(pos, pos + 4);
                    const lum = luminance(...point);
                    average += lum;
                    if (isNaN(lum) || lum === undefined) debugger;
                    pic.push(point);
                    if (pos / 4 > max)
                        max = pos/4;
                    //debugger;
                    
                }
            }
            const pixel = average / (DIF * DIF);
            if (isNaN(pixel)) debugger;
            pixels.push(pixel);
        }
    }
    console.log(`Max: ${max}`);
    return pixels;
}

export async function split() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.src = imgSrc;
    
    return new Promise((res, rej) => {
        image.addEventListener('load', function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const scanned = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const parsed = stampToPixelArray(scanned.data, image.width, image.height);

            res({ data: parsed, DIF, width: Math.floor(image.width / DIF), image });
        })
    })
    
}

export function drawto(canvasId, data, width) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const height = Math.floor(data.length / width);

    canvas.width = width;
    canvas.height = height;

    const canvasData = data.map(lum => [lum, lum, lum, 255]);
    const imageData = ctx.createImageData(width, height);
    let i = 0;
    canvasData.forEach(e => {
        imageData.data[i++] = e[0];
        imageData.data[i++] = e[1];
        imageData.data[i++] = e[2];
        imageData.data[i++] = e[3];
    })

    ctx.putImageData(imageData, 0, 0);
}

export function discretize(arr, stepsCount) {
    const stepHeight = 10;
    let min = Infinity;
    let max = 0;
    arr.forEach(el => {
        if (el < min) min = el;
        if (el > max) max = el;
    })

    const step = (max - min) / stepsCount;
    const steps = [];

    let level = min;

    while (level <= max) {
        steps.push(level);
        level += step;
    }

    steps[steps.length - 1] += 1;
    debugger
    const out = arr.map(value => stepHeight * (steps.findIndex(st => value <= st)));
    return out;
}