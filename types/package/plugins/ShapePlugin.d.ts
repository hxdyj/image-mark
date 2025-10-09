import { Action, ImageMark } from '../index';
import { Plugin } from './plugin';
import { ImageMarkShape, ShapeData, ShapeOptions } from '../shape/Shape';
import { DeepPartial } from 'utility-types';
export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
    shapeList: T[];
    shapeOptions?: ShapeOptions;
};
export declare class ShapePlugin<T extends ShapeData = ShapeData> extends Plugin {
    pluginOptions?: DeepPartial<ShapePluginOptions<T>> | undefined;
    static pluginName: string;
    protected node2ShapeInstanceWeakMap: WeakMap<T, ImageMarkShape<T>>;
    data: T[];
    disableActionList: Set<string>;
    constructor(imageMarkInstance: ImageMark, pluginOptions?: DeepPartial<ShapePluginOptions<T>> | undefined);
    getShapePluginOptions(options?: DeepPartial<ShapePluginOptions<T>>): ShapePluginOptions<T>;
    addAction(action: typeof Action, actionOptions?: any): void;
    removeAction(action: typeof Action): void;
    disableAction(action: string | string[]): void;
    enableAction(action: string | string[]): void;
    protected renderNewNode(node: T): void;
    protected createShape(): void;
    setData(data: T[]): void;
    bindEvent(): void;
    unbindEvent(): void;
    destroy(): void;
    emitPluginDataChange(): void;
    addNode(data: T, emit?: boolean): void;
    addNodes(dataList: T[], emit?: boolean): void;
    onDelete(_data: T, shapeInstance?: ImageMarkShape<T>): void;
    removeNode(data: T | ImageMarkShape<T>, emit?: boolean): void;
    removeNodes(dataList: T[] | ImageMarkShape<T>[], emit?: boolean): void;
    protected tempData: T[] | null;
    clear(): void;
    removeAllNodes(emit?: boolean): void;
    onScale(): void;
    onFirstRender(): void;
    onInit(): void;
    clearMap(): void;
    protected onRerender(): void;
    redrawNodes(): void;
    protected onResize(): void;
    protected renderNode(node: T): void;
    protected onDraw(): void;
    getInstanceByData(node: T): ImageMarkShape<T>;
    shape: {
        [key: string]: {
            ShapeClass: ImageMarkShape;
            shapeOptions?: ShapeOptions;
        };
    };
    getShapeOptions(shapeOptions?: ShapeOptions): any;
    addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): this;
    removeShape(shape: typeof ImageMarkShape<T>): this;
    initShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): this;
    drawingShape: ImageMarkShape<T> | null;
    programmaticDrawing: boolean;
    startDrawing(shape: ImageMarkShape<T>, programmaticDrawing?: boolean): this;
    drawing(shapeData: T): this;
    endDrawing(cancel?: boolean): this;
    drawingMouseTrace: Array<MouseEvent>;
    shiftMouseEvent2LimitMouseEvent(evt: Event | MouseEvent): {
        event: MouseEvent;
        limit: boolean;
    };
    drawingMouseTracePush(event: MouseEvent): boolean;
    dropLastMouseTrace(): void;
    holdShape: ImageMarkShape | null;
    setHoldShape(shape: ImageMarkShape | null): void;
    onContainerMouseDown(event: MouseEvent): void;
    onContainerMouseMove(event: MouseEvent): void;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
    onReadonlyChange(readonly: boolean): void;
    static shapeList: Array<{
        shape: typeof ImageMarkShape;
        shapeOptions?: ShapeOptions;
    }>;
    static useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): {
        new (imageMarkInstance: ImageMark, pluginOptions?: DeepPartial<ShapePluginOptions<T>> | undefined): ShapePlugin<T>;
        pluginName: string;
        shapeList: Array<{
            shape: typeof ImageMarkShape;
            shapeOptions?: ShapeOptions;
        }>;
        useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): /*elided*/ any;
        unuseShape<T_1 extends ShapeData>(shape: typeof ImageMarkShape<T_1>): typeof ShapePlugin;
        hasShape<T_1 extends ShapeData>(shape: typeof ImageMarkShape<T_1>): {
            shape: typeof ImageMarkShape;
            shapeOptions?: ShapeOptions;
        } | undefined;
        useDefaultShape(): void;
        unuseDefaultShape(): void;
        pluginOptions: import('./plugin').PluginOptions;
    };
    static unuseShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): typeof ShapePlugin;
    static hasShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): {
        shape: typeof ImageMarkShape;
        shapeOptions?: ShapeOptions;
    } | undefined;
    static useDefaultShape(): void;
    static unuseDefaultShape(): void;
}
