import { default as ImageMark } from '..';
import { Action } from './action';
import { ImageMarkShape } from '../shape/Shape';
import { Rect, StrokeData } from '@svgdotjs/svg.js';
export type SelectionDrawFunc = (selection: SelectionAction) => void;
export type SelectionActionAttr = {
    stroke?: StrokeData;
    fill?: string;
    padding?: number;
    whileSelectedEditShape?: boolean;
};
export type SelectionActionOptions = {
    initDrawFunc?: SelectionDrawFunc;
    setAttr?: (action: SelectionAction) => SelectionActionAttr;
};
export declare class SelectionAction extends Action {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: SelectionActionOptions | undefined;
    static actionName: string;
    protected uid: string;
    selected: boolean;
    attr: SelectionActionAttr;
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: SelectionActionOptions | undefined);
    protected bindEvents(): void;
    protected unbindEvent(): void;
    getSelectionActionOptions(): SelectionActionOptions;
    getSelectionShape(): Rect | undefined;
    getSelectionId(): string;
    disableSelection(): void;
    enableSelection(): void;
    onReadonlyChange(readonly: boolean): void;
    draw(): void;
    destroy(): void;
    private downTime;
    getEnableSelection(): boolean;
    protected onMouseDown(event: Event): void;
    protected onMouseUp(event: Event): void;
}
