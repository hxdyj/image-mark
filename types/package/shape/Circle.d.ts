import { G } from '@svgdotjs/svg.js';
import { EditPointItem, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
import { RectEditPointClassName } from './Rect';
export interface CircleData extends ShapeData {
    shapeName: "circle";
    x: number;
    y: number;
    r: number;
}
export type CircleEditPointClassName = Extract<RectEditPointClassName, 'tl' | 'tr' | 'bl' | 'br'>;
export type CircleEditPointItem = EditPointItem<CircleEditPointClassName>;
export declare class ImageMarkCircle extends ImageMarkShape<CircleData> {
    static shapeName: string;
    constructor(data: CircleData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    readonly drawType = "centerR";
    draw(): G;
    translate(x: number, y: number): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null;
    drawEdit(): void;
    getEditR(event: MouseEvent): number;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
}
