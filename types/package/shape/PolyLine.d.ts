import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface PolyLineData extends ShapeData {
    shapeName: "polyline";
    points: number[];
    auxiliaryPoint?: [number, number];
}
export declare class ImageMarkPolyLine extends ImageMarkShape<PolyLineData> {
    static shapeName: string;
    readonly mouseDrawType: ShapeMouseDrawType;
    constructor(data: PolyLineData, imageMarkInstance: ImageMark, options: ShapeOptions);
    dmoveData(dmove: [number, number]): PolyLineData;
    draw(): G;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolyLineData | null;
}
