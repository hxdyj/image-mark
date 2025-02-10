import { G, Shape } from '@svgdotjs/svg.js';
import { ImageMark } from '../index';
import { Action } from '../action/action';
import { DeepPartial } from '@arco-design/web-react/es/Form/store';
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0];
export type MouseEvent2DataOptions = {
    eventList?: MouseEvent[];
    auxiliaryEvent?: MouseEvent;
};
export type ShapeOptions = {
    afterRender?: (shapeInstance: ImageMarkShape) => void;
    initDrawFunc?: ShapeDrawFunc;
};
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress';
export type ShapeDrawFunc = (shape: ImageMarkShape) => void;
export type ShapeTransform = {
    matrix: {
        a: number;
        b: number;
        c: number;
        d: number;
        e: number;
        f: number;
    };
};
export declare function getDefaultTransform(option?: DeepPartial<ShapeTransform>): ShapeTransform;
export declare abstract class ImageMarkShape<T extends ShapeData = ShapeData> {
    data: T;
    options: ShapeOptions;
    shapeInstance: G;
    isRendered: boolean;
    isBindActions: boolean;
    static shapeName: string;
    imageMark: ImageMark;
    uid: string;
    action: {
        [key: string]: Action;
    };
    constructor(data: T, imageMarkInstance: ImageMark, options: ShapeOptions);
    abstract draw(): G;
    protected drawFuncList: ShapeDrawFunc[];
    addDrawFunc(func: ShapeDrawFunc): void;
    removeDrawFunc(func: ShapeDrawFunc): void;
    getMainShape<T = Shape>(): T;
    getMainId(): string;
    updateData(data: T): G;
    readonly mouseDrawType: ShapeMouseDrawType;
    private mouseMoveThreshold;
    getMouseMoveThreshold(): number;
    setMouseMoveThreshold(threshold: number): void;
    mouseEvent2Data(options?: MouseEvent2DataOptions): T | null;
    bindActions(): void;
    afterRender(): void;
    destroy(): void;
    render(stage: AddToShape): void;
    private actionAfterRenderNeedAdd;
    addAction(action: typeof Action, actionOptions?: any): void;
    removeAction(action: typeof Action): void;
    initAction(action: typeof Action, actionOptions?: any): void;
    static actionList: Array<typeof Action>;
    static useAction(action: typeof Action, actionOptions?: any): typeof ImageMarkShape;
    static unuseAction(action: typeof Action): typeof ImageMarkShape;
    static hasAction(action: typeof Action): boolean;
    rotate(angle: number): this;
    static useDefaultAction(): void;
    static unuseDefaultAction(): void;
}
export interface ShapeData {
    shapeName: string;
    transform?: ShapeTransform;
    [x: string]: any;
}
