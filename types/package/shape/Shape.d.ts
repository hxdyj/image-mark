import { G, Shape, StrokeData } from '@svgdotjs/svg.js';
import { ImageMark } from '../index';
import { EventBindingThis } from '../event/event';
import { Action } from '../action/action';
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0];
export type MouseEvent2DataOptions = {
    eventList?: MouseEvent[];
    auxiliaryEvent?: MouseEvent;
};
export type ShapeAttr = {
    stroke?: StrokeData;
    fill?: string;
    auxiliary?: {
        stroke?: StrokeData;
    };
    label?: {
        font?: {
            fill?: string;
            size?: number;
        };
        fill?: string;
    };
    dot?: {
        r?: number;
    };
    image?: {
        opacity?: number;
        preserveAspectRatio?: 'xMidYMid' | 'none';
    };
} | undefined;
export type ShapeOptions = {
    setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr;
    afterRender?: (shapeInstance: ImageMarkShape) => void;
    initDrawFunc?: ShapeDrawFunc;
};
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress';
export type ShapeDrawType = 'point' | 'centerR' | 'centerRxy';
export type ShapeDrawFunc = (shape: ImageMarkShape) => void;
export type EditPointItem<T extends string | number = string | number> = {
    x: number;
    y: number;
    className: T;
};
export declare abstract class ImageMarkShape<T extends ShapeData = ShapeData> extends EventBindingThis {
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
    attr: ShapeAttr;
    constructor(data: T, imageMarkInstance: ImageMark, options: ShapeOptions);
    abstract draw(): G;
    protected drawFuncList: ShapeDrawFunc[];
    drawLabel(): void;
    onEndDrawing(): void;
    actionListForEach(callback: (action: Action) => void): void;
    onContainerMouseMove(event: MouseEvent): void;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
    addDrawFunc(func: ShapeDrawFunc): void;
    removeDrawFunc(func: ShapeDrawFunc): void;
    getMainShape<T = Shape>(): T;
    getLabelShape<T = Shape>(): T;
    getEditGroup<T = G>(): T;
    getEditGroupId(): string;
    getLabelId(): string;
    getMainId(): string;
    updateData(data: T): G;
    readonly mouseDrawType: ShapeMouseDrawType;
    readonly drawType: ShapeDrawType;
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
    abstract translate(x: number, y: number): void;
    protected editOn: boolean;
    abstract drawEdit(): void;
    editMouseDownEvent: MouseEvent | null;
    editOriginData: T | null;
    startEditShape(event: Event): void;
    endEditShape(): void;
    removeEdit(): void;
    edit(on?: boolean, needDraw?: boolean): boolean;
    onReadonlyChange(readonly: boolean): void;
    getMainShapeInfo(): {
        strokeWidth: any;
        strokeColor: string;
        optimalStrokeColor: string;
    };
    static useDefaultAction(): void;
    static unuseDefaultAction(): void;
}
export interface ShapeData {
    shapeName: string;
    label?: string;
    [x: string]: any;
}
