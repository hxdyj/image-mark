import { Circle, G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MinimapDrawContext, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
export interface PolyLineData extends ShapeData {
    shapeName: "polyline";
    points: number[];
    auxiliaryPoint?: [number, number];
}
export declare class ImageMarkPolyLine extends ImageMarkShape<PolyLineData> {
    static shapeName: string;
    static minVertexCount: number;
    readonly mouseDrawType: ShapeMouseDrawType;
    private lastVertexClickTime;
    private lastVertexClickIndex;
    constructor(data: PolyLineData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    fixData(data?: PolyLineData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): PolyLineData | null;
    onEndDrawing(): void;
    getEditPointClassName(className: number): string;
    getMidPointClassName(index: number): string;
    drawEdit(): void;
    onMidPointMouseDown: (event: Event) => void;
    onVertexMouseDown: (event: Event) => void;
    deleteVertex(index: number): boolean;
    getVertexCount(): number;
    canDeleteVertex(): boolean;
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
