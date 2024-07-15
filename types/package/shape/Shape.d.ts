import { Shape } from '@svgdotjs/svg.js';
import { ImageMark } from '../index';

export declare abstract class ImageMarkShape {
    protected data: ShapeData;
    abstract shapeInstance: Shape;
    private isRendered;
    static shapeName: string;
    imageMark: ImageMark;
    constructor(data: ShapeData, imageMarkInstance: ImageMark);
    abstract draw(): Shape;
    render(stage: Parameters<InstanceType<typeof Shape>['addTo']>[0]): void;
}
export interface ShapeData {
    shapeName: string;
    [x: string]: any;
}
