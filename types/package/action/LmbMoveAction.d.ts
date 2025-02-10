import { MatrixExtract, Point } from '@svgdotjs/svg.js';
import { default as ImageMark, ArrayPoint } from '..';
import { Action } from './action';
import { ImageMarkShape } from '../shape/Shape';
export type LmbMoveActionOptions = {
    onStart?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void;
    onMove?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void;
    onEnd?: (imageMark: ImageMark, shape: ImageMarkShape, event: MouseEvent) => void;
    limit?: (imageMark: ImageMark, shape: ImageMarkShape, nextTransform: MatrixExtract) => ArrayPoint;
};
export declare class LmbMoveAction extends Action {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: LmbMoveActionOptions | undefined;
    static actionName: string;
    protected moveable: boolean;
    protected status: {
        mouseDown: boolean;
    };
    protected startPoint: Point | null;
    protected startTransform: MatrixExtract | null;
    protected uid: string;
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: LmbMoveActionOptions | undefined);
    protected bindEvents(): void;
    protected unbindEvent(): void;
    disableMove(): void;
    enableMove(): void;
    getEnableMove(): boolean;
    destroy(): void;
    protected onMouseDown(event: Event): void;
    protected onDoucmentMouseMoving(event: MouseEvent): ArrayPoint | undefined;
    protected onDocumentMouseUp(event: MouseEvent): void;
}
