import { G, Point } from '@svgdotjs/svg.js';
import { ImageMarkShape, MinimapDrawContext, MouseEvent2DataOptions, ShapeData, ShapeDrawType, ShapeOptions } from './Shape';
import { ImageMark } from '../index';
import { RectEditPointClassName } from './Rect';
export interface ImageData extends ShapeData {
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    shapeName: 'image';
}
export declare class ImageMarkImage extends ImageMarkShape<ImageData> {
    static shapeName: string;
    readonly mouseDrawType: "multiPress";
    constructor(data: ImageData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    sourceWH: {
        width: number;
        height: number;
    } | null;
    protected loadUrl: string;
    readonly drawType: ShapeDrawType;
    draw(): G;
    protected drawInfo(): void;
    onEndDrawing(): void;
    translate(x: number, y: number): void;
    fixData(data?: ImageData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): ImageData | null;
    drawEdit(): void;
    getEditEventPointType(): RectEditPointClassName;
    getEditPoint(event: MouseEvent): [Point, Point];
    onDocumentMouseMove(event: MouseEvent, emit?: boolean): void;
    onDocumentMouseUp(event: MouseEvent): void;
    private minimapImageCache?;
    private minimapImageSrc?;
    drawMinimap(drawContext: MinimapDrawContext): void;
    private drawMinimapPlaceholder;
}
