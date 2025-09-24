import { Circle, G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
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
    translate(x: number, y: number): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null;
    getEditPointClassName(className: number): string;
    drawEdit(): void;
    onEndDrawing(): void;
    getEditShape(): Circle;
    getEditEventPointIndex(): any;
    getEditPoint(event: MouseEvent): {
        index: number;
        point: Point;
    };
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
}
