import { ImageMark } from '..';
import { Plugin } from '.';
import { ImageMarkShape, ShapeData, ShapeOptions } from '../shape/Shape';
export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
    shapeList: T[];
};
export declare class ShapePlugin<T extends ShapeData = ShapeData> extends Plugin {
    static pluginName: string;
    protected node2ShapeInstanceWeakMap: WeakMap<T, ImageMarkShape<ShapeData>>;
    protected shapeInstance2NodeWeakMap: WeakMap<ImageMarkShape<ShapeData>, T>;
    data: T[];
    disableActionList: Set<string>;
    constructor(imageMarkInstance: ImageMark);
    disableAction(action: string | string[]): void;
    enableAction(action: string | string[]): void;
    protected addNode(node: T): void;
    protected createShape(): void;
    bindEvent(): void;
    unbindEvent(): void;
    destroy(): void;
    onAdd(data: T, emit?: boolean): void;
    onDelete(_data: T, shapeInstance: ImageMarkShape): void;
    clear(): void;
    onInit(): void;
    clearMap(): void;
    protected onRerender(): void;
    protected onResize(): void;
    protected renderNode(node: T): void;
    protected onDraw(): void;
    getInstanceByData(data: T): ImageMarkShape<ShapeData> | undefined;
    shape: {
        [key: string]: {
            ShapeClass: ImageMarkShape;
            shapeOptions?: ShapeOptions;
        };
    };
    addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): this;
    removeShape(shape: typeof ImageMarkShape<T>): this;
    initShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): this;
    drawingShape: ImageMarkShape<T> | null;
    programmaticDrawing: boolean;
    startDrawing(shape: ImageMarkShape<T>, programmaticDrawing?: boolean): this;
    drawing(shapeData: T): this;
    endDrawing(cancel?: boolean): this;
    drawingMouseTrace: Array<MouseEvent>;
    dropLastMouseTrace(): void;
    onDrawingMouseDown(event: MouseEvent): void;
    onDrawingMouseMove(event: MouseEvent): void;
    onDrawingDocumentMouseMove(event: MouseEvent): void;
    onDrawingDocumentMouseUp(event: MouseEvent): void;
    static shapeList: Array<typeof ImageMarkShape>;
    static useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): {
        new (imageMarkInstance: ImageMark): ShapePlugin<T>;
        pluginName: string;
        shapeList: Array<typeof ImageMarkShape>;
        useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): any;
        unuseShape<T_1 extends ShapeData>(shape: typeof ImageMarkShape<T_1>): typeof ShapePlugin;
        hasShape<T_1 extends ShapeData>(shape: typeof ImageMarkShape<T_1>): typeof ImageMarkShape | undefined;
    };
    static unuseShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): typeof ShapePlugin;
    static hasShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): typeof ImageMarkShape | undefined;
}
