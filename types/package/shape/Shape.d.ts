import { Shape } from '@svgdotjs/svg.js';

export declare abstract class ImageMarkShape {
    protected data: ShapeData;
    abstract shapeInstance: Shape;
    private isRendered;
    static shapeName: string;
    constructor(data: ShapeData);
    abstract draw(): Shape;
    render(stage: Parameters<InstanceType<typeof Shape>['addTo']>[0]): void;
}
export interface ShapeData {
    shapeName: string;
    [x: string]: any;
}
