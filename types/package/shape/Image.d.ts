import { Image } from '@svgdotjs/svg.js';
import { ImageMarkShape, ShapeData, ShapeType } from './Shape';

export interface ImageData extends ShapeData {
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    type: ShapeType.Image;
}
export declare class ImageMarkImage extends ImageMarkShape {
    shapeInstance: Image;
    constructor(data: ImageData);
    draw(): Image;
}
