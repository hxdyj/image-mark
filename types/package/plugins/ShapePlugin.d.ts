import { ImageMark } from '..';
import { Plugin } from '.';
import { ImageMarkShape, ShapeData } from '../shape/Shape';

export declare class ShapePlugin extends Plugin {
    static pluginName: string;
    private node2ShapeInstanceWeakMap;
    data: ShapeData[];
    constructor(imageMarkInstance: ImageMark);
    createShape(): void;
    bindEvent(): void;
    unbindEvent(): void;
    onInit(): void;
    onRerender(): void;
    onDraw(): void;
    static shapeList: Array<typeof ImageMarkShape>;
    static registerShape(shape: typeof ImageMarkShape): typeof ShapePlugin;
    static hasShape(shape: typeof ImageMarkShape): typeof ImageMarkShape | undefined;
}
