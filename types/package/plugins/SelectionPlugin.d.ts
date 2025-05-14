import { ImageMark } from '..';
import { Plugin } from './plugin';
import { ImageMarkShape } from '../shape/Shape';
import { SelectionAction, SelectionActionOptions } from '../action/SelectionAction';
export type SelectionPluginOptions = {
    selectionActionOptions?: SelectionActionOptions;
};
export type SelectionType = 'single' | 'multiple';
export declare class SelectionPlugin extends Plugin {
    selectionPluginOptions?: SelectionPluginOptions | undefined;
    static pluginName: string;
    selectShapeList: ImageMarkShape[];
    private _mode;
    constructor(imageMarkInstance: ImageMark, selectionPluginOptions?: SelectionPluginOptions | undefined);
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
    destroy(): void;
}
