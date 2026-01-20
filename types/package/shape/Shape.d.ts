import { G, Point, Shape, StrokeData } from '@svgdotjs/svg.js';
import { ImageMark, ImageMarkOptions } from '../index';
import { EventBindingThis } from '../event/event';
import { Action } from '../action/action';
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0];
export type MouseEvent2DataOptions = {
    pointList?: Point[];
    auxiliaryPoint?: Point;
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
    options?: ShapeOptions | undefined;
    shapeInstance: G;
    isRendered: boolean;
    isBindActions: boolean;
    static shapeName: string;
    imageMark: ImageMark;
    action: {
        [key: string]: Action;
    };
    attr: ShapeAttr;
    constructor(data: T, imageMarkInstance: ImageMark, options?: ShapeOptions | undefined);
    getOptions(options?: ShapeOptions): ShapeOptions;
    bindEvent(): void;
    unbindEvent(): void;
    abstract draw(): G;
    protected drawFuncList: ShapeDrawFunc[];
    drawLabel(): G | undefined;
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
    updateData(data: T, emit?: boolean): G;
    getPreStatusOperateActionName(): keyof ImageMarkOptions['action'] | null;
    clampX(x: number, fixMax?: number, fixMin?: number): number;
    clampY(y: number, fixMax?: number, fixMin?: number): number;
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
    addAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions?: any): void;
    removeAction(action: typeof Action): void;
    initAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions?: any): void;
    static actionList: Array<typeof Action>;
    static useAction<ActionType extends typeof Action = typeof Action>(action: ActionType, actionOptions?: any): typeof ImageMarkShape;
    static unuseAction<ActionType extends typeof Action = typeof Action>(action: ActionType): typeof ImageMarkShape;
    static hasAction<ActionType extends typeof Action = typeof Action>(action: ActionType): boolean;
    abstract translate(x: number, y: number): void;
    abstract fixData(data?: T): void;
    protected editOn: boolean;
    abstract drawEdit(): void;
    editMouseDownEvent: MouseEvent | null;
    editOriginData: T | null;
    startEditShape(event: Event): void;
    endEditShape(): void;
    dataSnapshot: T | null;
    startModifyData(): void;
    removeEdit(): void;
    edit(on?: boolean, needDraw?: boolean): boolean;
    onReadonlyChange(readonly: boolean): void;
    getMainShapeInfo(): {
        strokeWidth: any;
        strokeColor: string;
        optimalStrokeColor: string;
    };
    onContextMenu(event: Event): void;
    mouseDownEvent: MouseEvent | null;
    onMouseDown(event: Event): void;
    onMouseUp(event: Event): void;
    static useDefaultAction(): void;
    static unuseDefaultAction(): void;
}
export interface ShapeData {
    uuid?: string;
    shapeName: string;
    label?: string;
    [x: string]: any;
}
