import { ImageMarkShape, ShapeData } from '../shape/Shape';
import { default as ImageMark, ArrayPoint } from '../index';
import { Plugin } from './plugin';
export type HistoryPluginOptions = {};
export declare class HistoryPlugin extends Plugin {
    static pluginName: string;
    stack: History[];
    redoStack: History[];
    constructor(imageMarkInstance: ImageMark);
    getStackInfo(): {
        undo: number;
        redo: number;
    };
    bindEvent(): void;
    unbindEvent(): void;
    tmpHistory: History | null;
    emitHistoryChange(): void;
    push(history: History, clear?: boolean): void;
    undo(): void;
    redo(): void;
    onShapeAdd(data: ShapeData): void;
    onShapeDelete(data: ShapeData): void;
    onShapeStartMove(shape: ImageMarkShape): void;
    onShapeEndMove(shape: ImageMarkShape, diff: ArrayPoint): void;
    onShapeStartEdit(shape: ImageMarkShape): void;
    onShapeEndEdit(shape: ImageMarkShape): void;
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
