import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface DotData extends ShapeData {
    shapeName: "dot";
    x: number;
    y: number;
    r: number;
}
export declare class ImageMarkDot extends ImageMarkShape<DotData> {
    static shapeName: string;
    constructor(data: DotData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    mouseEvent2Data(options: MouseEvent2DataOptions): DotData | null;
}
