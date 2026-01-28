import { Circle, G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MinimapDrawContext, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
export interface PolygonData extends ShapeData {
    shapeName: "polygon";
    points: number[];
    auxiliaryPoint?: [number, number];
}
export declare class ImageMarkPolygon extends ImageMarkShape<PolygonData> {
    static shapeName: string;
    static minVertexCount: number;
    readonly mouseDrawType: ShapeMouseDrawType;
    private lastVertexClickTime;
    private lastVertexClickIndex;
    constructor(data: PolygonData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    fixData(data?: PolygonData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolygonData | null;
    getEditPointClassName(className: number): string;
    getMidPointClassName(index: number): string;
    drawEdit(): void;
    onMidPointMouseDown: (event: Event) => void;
    onVertexMouseDown: (event: Event) => void;
    deleteVertex(index: number): boolean;
    getVertexCount(): number;
    canDeleteVertex(): boolean;
    onEndDrawing(): void;
    getEditShape(): Circle;
    getEditEventPointIndex(): any;
    getEditPoint(event: MouseEvent): {
        index: number;
        point: Point;
    };
    onDocumentMouseMove(event: MouseEvent, emit?: boolean): void;
    onDocumentMouseUp(event: MouseEvent): void;
    drawMinimap(drawContext: MinimapDrawContext): void;
}
