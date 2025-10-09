import { ImageMark } from '..';
import { Plugin } from './plugin';
import { ImageMarkShape, ShapeData } from '../shape/Shape';
import { SelectionAction, SelectionActionOptions } from '../action/SelectionAction';
import { DeepPartial } from 'utility-types';
export type SelectionPluginOptions = {
    selectionActionOptions?: SelectionActionOptions;
};
export type SelectionType = 'single' | 'multiple';
export declare class SelectionPlugin extends Plugin {
    pluginOptions?: DeepPartial<SelectionPluginOptions> | undefined;
    static pluginName: string;
    selectShapeList: ImageMarkShape[];
    private _mode;
    constructor(imageMarkInstance: ImageMark, pluginOptions?: DeepPartial<SelectionPluginOptions> | undefined);
    getSelectionPluginOptions(options?: DeepPartial<SelectionPluginOptions>): SelectionPluginOptions;
    onShapeAfterRender(shapeInstance: ImageMarkShape): void;
    mode(newMode?: SelectionType): SelectionType;
    onSelectionActionClick(shape: ImageMarkShape): void;
    getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined;
    selectShape(shape: ImageMarkShape): void;
    selectShapes(shapeList: ImageMarkShape[]): void;
    unselectShape(shape: ImageMarkShape): void;
    unselectShapes(shapeList: ImageMarkShape[]): void;
    clear(): void;
    bindEvent(): void;
    unbindEvent(): void;
    onShapeDelete(data: ShapeData, shape: ImageMarkShape): void;
    onShapeDeletePatch(dataList: ShapeData[]): void;
    onShapeDeleteAll(): void;
    destroy(): void;
    static useDefaultAction(): void;
    static unuseDefaultAction(): void;
}
