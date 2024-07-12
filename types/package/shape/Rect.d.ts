import { Rect } from '@svgdotjs/svg.js';
import { ImageMarkShape, ShapeData } from './Shape';
import { BoundingBox } from '..';

export interface RectData extends BoundingBox, ShapeData {
    shapeName: "rect";
}
export declare class ImageMarkRect extends ImageMarkShape {
    shapeInstance: Rect;
    constructor(data: RectData);
    draw(): Rect;
}
