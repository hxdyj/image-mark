import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface CircleData extends ShapeData {
    shapeName: "circle";
    x: number;
    y: number;
    r: number;
}
export declare class ImageMarkCircle extends ImageMarkShape<CircleData> {
    static shapeName: string;
    constructor(data: CircleData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null;
}
