import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MinimapDrawContext, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { default as ImageMark } from '../index';
export interface PathLineData extends ShapeData {
    shapeName: "pathline";
    points: number[];
}
export declare class ImageMarkPathLine extends ImageMarkShape<PathLineData> {
    static shapeName: string;
    constructor(data: PathLineData, imageMarkInstance: ImageMark, options?: ShapeOptions);
    draw(): G;
    translate(x: number, y: number): void;
    fixData(data?: PathLineData | undefined): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): PathLineData | null;
    drawEdit(): void;
    drawMinimap(drawContext: MinimapDrawContext): void;
}
