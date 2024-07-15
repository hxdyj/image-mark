import { ImageMark } from '..';
import { Plugin } from '.';
import { ImageMarkShape, ShapeData } from '../shape/Shape';

export declare class ShapePlugin extends Plugin {
    static pluginName: string;
    private node2ShapeInstanceWeakMap;
    private shapeInstance2NodeWeakMap;
    data: ShapeData[];
    constructor(imageMarkInstance: ImageMark);
    private addNode;
    private createShape;
    private bindEvent;
    private unbindEvent;
    rerender(): void;
    onAdd(data: ShapeData, emit?: boolean): void;
    onDelete(_data: ShapeData, shapeInstance: ImageMarkShape): void;
    private onInit;
    private onRerender;
    private renderNode;
    private onDraw;
    static shapeList: Array<typeof ImageMarkShape>;
    static registerShape(shape: typeof ImageMarkShape): typeof ShapePlugin;
    static hasShape(shape: typeof ImageMarkShape): typeof ImageMarkShape | undefined;
}
