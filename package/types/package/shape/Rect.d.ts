import { Rect } from '@svgdotjs/svg.js';
import { ImageMarkShape, ShapeData, ShapeType } from './Shape';

export interface RectData extends ShapeData {
    x: number;
    y: number;
    width: number;
    height: number;
    type: ShapeType.Rect;
}
export declare class ImageMarkRect extends ImageMarkShape {
    shapeInstance: Rect;
    constructor(data: RectData);
    draw(): Rect;
}
