import { G } from '@svgdotjs/svg.js';
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from './Shape';
import { ImageMark } from '..';
export interface ImageData extends ShapeData {
    x: number;
    y: number;
    width?: number;
    height?: number;
    src: string;
    shapeName: 'image';
}
export declare class ImageMarkImage extends ImageMarkShape<ImageData> {
    static shapeName: string;
    constructor(data: ImageData, imageMarkInstance: ImageMark, options: ShapeOptions);
    protected loadUrl: string;
    draw(): G;
    protected drawInfo(): void;
    mouseEvent2Data(options: MouseEvent2DataOptions): ImageData | null;
}
