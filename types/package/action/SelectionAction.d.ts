import { default as ImageMark } from '..';
import { Action } from '.';
import { ImageMarkShape } from '../shape/Shape';
import { Rect } from '@svgdotjs/svg.js';
export type SelectionDrawFunc = (selection: SelectionAction) => void;
export type SelectionActionOptions = {
    initDrawFunc?: SelectionDrawFunc;
};
export declare class SelectionAction extends Action {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: SelectionActionOptions | undefined;
    static actionName: string;
    protected uid: string;
    selected: boolean;
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: SelectionActionOptions | undefined);
    protected bindEvents(): void;
    protected unbindEvent(): void;
    getSelectionShape(): Rect | undefined;
    getSelectionId(): string;
    disableSelection(): void;
    enableSelection(): void;
    private draw;
    destroy(): void;
    private downTime;
    protected onMouseDown(event: Event): void;
    protected onMouseUp(event: Event): void;
}
