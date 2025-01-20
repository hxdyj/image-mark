import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface PolygonData extends ShapeData {
    shapeName: "polygon";
    points: number[];
    auxiliaryPoint?: [number, number];
}
export declare class ImageMarkPolygon extends ImageMarkShape<PolygonData> {
    static shapeName: string;
    readonly mouseDrawType: ShapeMouseDrawType;
    constructor(data: PolygonData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null;
}
