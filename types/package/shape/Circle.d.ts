import { G } from '@svgdotjs/svg.js';
import { EditPointItem, ImageMarkShape, MinimapDrawContext, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
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
    readonly mouseDrawType: "multiPress";
    readonly drawType: "centerR";
    constructor(data: CircleData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    draw(): G;
    protected getCenterPointId(): string;
    protected drawCenterPoint(): void;
    protected removeCenterPoint(): void;
    translate(x: number, y: number): void;
    fixData(data?: CircleData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): CircleData | null;
    onEndDrawing(): void;
    drawEdit(): void;
    getEditR(event: MouseEvent): number;
    onDocumentMouseMove(event: MouseEvent, emit?: boolean): void;
    onDocumentMouseUp(event: MouseEvent): void;
    drawMinimap(drawContext: MinimapDrawContext): void;
}
