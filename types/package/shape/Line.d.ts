import { Circle, G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '..';
export interface LineData extends ShapeData {
    shapeName: "line";
    x: number;
    y: number;
    x2: number;
    y2: number;
}
export declare class ImageMarkLine extends ImageMarkShape<LineData> {
    static shapeName: string;
    readonly mouseDrawType: "multiPress";
    constructor(data: LineData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    fixData(data?: LineData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): LineData | null;
    getEditPointClassName(className: number): string;
    drawEdit(): void;
    getEditShape(): Circle;
    getEditEventPointIndex(): any;
    getEditPoint(event: MouseEvent): {
        index: number;
        point: Point;
    };
    onDocumentMouseMove(event: MouseEvent, emit?: boolean): void;
    onDocumentMouseUp(event: MouseEvent): void;
}
