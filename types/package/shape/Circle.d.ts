import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface CircleData extends ShapeData {
    shapeName: "circle";
    r: number;
}
export declare class ImageMarkCircle extends ImageMarkShape<CircleData> {
    static shapeName: string;
    constructor(data: CircleData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null;
}
