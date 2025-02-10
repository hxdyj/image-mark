import { G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark, BoundingBox } from '..';
export interface RectData extends BoundingBox, ShapeData {
    shapeName: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare function getBoundingBoxByTwoPoints(point1: Point, point2: Point): BoundingBox;
export declare class ImageMarkRect extends ImageMarkShape<RectData> {
    static shapeName: string;
    constructor(data: RectData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    mouseEvent2Data(options: MouseEvent2DataOptions): RectData | null;
}
