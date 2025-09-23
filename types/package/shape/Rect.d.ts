import { G, Point } from '@svgdotjs/svg.js';
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark, BoundingBox } from '../index';
export interface RectData extends BoundingBox, ShapeData {
    shapeName: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare function getBoundingBoxByTwoPoints(point1: Point, point2: Point): BoundingBox;
export type RectEditPointClassName = 'tl' | 't' | 'tr' | 'b' | 'bl' | 'br' | 'l' | 'r';
export type RectEditPointItem = EditPointItem<RectEditPointClassName>;
export declare class ImageMarkRect extends ImageMarkShape<RectData> {
    static shapeName: string;
    constructor(data: RectData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): RectData | null;
    drawEdit(): void;
    getEditEventPointType(): RectEditPointClassName;
    getEditPoint(event: MouseEvent): [Point, Point];
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
}
