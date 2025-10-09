import { ShapeData } from '../shape/Shape';
import { default as ImageMark } from '../index';
import { Plugin } from './plugin';
import { DeepPartial } from 'utility-types';
export type HistoryPluginOptions = {};
export declare class HistoryPlugin extends Plugin {
    pluginOptions?: DeepPartial<HistoryPluginOptions> | undefined;
    static pluginName: string;
    stack: History[];
    redoStack: History[];
    constructor(imageMarkInstance: ImageMark, pluginOptions?: DeepPartial<HistoryPluginOptions> | undefined);
    getHistoryPluginOptions(options?: DeepPartial<HistoryPluginOptions>): HistoryPluginOptions;
    getStackInfo(): {
        undo: number;
        redo: number;
    };
    bindEvent(): void;
    unbindEvent(): void;
    emitHistoryChange(): void;
    push(history: History, clear?: boolean): void;
    undo(): void;
    redo(): void;
    onShapeAdd(data: ShapeData): void;
    onShapeDelete(data: ShapeData): void;
    onShapeDeletePatch(dataList: ShapeData[]): void;
    onShapeDeleteAll(dataList: ShapeData[]): void;
    onShapePluginSetData(data: ShapeData[], oldData: ShapeData[]): void;
    onShapeUpdateData(newData: ShapeData, oldData: ShapeData): void;
    destroy(): void;
    clear(): void;
}
export declare abstract class History<T extends object | number | string = object> {
    static operate: string;
    oldData: T | undefined;
    newData: T | undefined;
    constructor(oldData?: T, newData?: T);
    setOldData(oldData: T): void;
    setNewData(newData: T): void;
    abstract undo(imageMarkInstance: ImageMark): void;
    abstract redo(imageMarkInstance: ImageMark): void;
}
export declare class ShapeEditHistory extends History<ShapeData> {
    static operate: string;
    constructor(oldData?: ShapeData, newData?: ShapeData);
    undo(imageMark: ImageMark): void;
    redo(imageMark: ImageMark): void;
}
export declare class ShapeExistHistory extends History<ShapeData> {
    static operate: string;
    constructor(oldData?: ShapeData, newData?: ShapeData);
    undo(imageMark: ImageMark): void;
    redo(imageMark: ImageMark): void;
}
export declare class ShapePatchExistHistory extends History<ShapeData[]> {
    static operate: string;
    constructor(oldData?: ShapeData[], newData?: ShapeData[]);
    undo(imageMark: ImageMark): void;
    redo(imageMark: ImageMark): void;
}
