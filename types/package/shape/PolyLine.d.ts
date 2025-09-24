import { Circle, G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
export interface PolyLineData extends ShapeData {
    shapeName: "polyline";
    points: number[];
    auxiliaryPoint?: [number, number];
}
export declare class ImageMarkPolyLine extends ImageMarkShape<PolyLineData> {
    static shapeName: string;
    readonly mouseDrawType: ShapeMouseDrawType;
    constructor(data: PolyLineData, imageMarkInstance: ImageMark, options: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolyLineData | null;
    onEndDrawing(): void;
    getEditPointClassName(className: number): string;
    drawEdit(): void;
    getEditShape(): Circle;
    getEditEventPointIndex(): any;
    getEditPoint(event: MouseEvent): {
        index: number;
        point: Point;
    };
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
}
