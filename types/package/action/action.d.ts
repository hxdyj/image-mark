import { EventBindingThis } from '../event/event';
import { ImageMarkShape } from '../shape/Shape';
import { default as ImageMark } from '..';
import { ShapePlugin } from '../plugins/ShapePlugin';
export declare class Action extends EventBindingThis {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: any | undefined;
    static actionName: string;
    static actionOptions: {
        [key: string]: any;
    };
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: any | undefined);
    destroy(): void;
    protected getShapePlugin(): ShapePlugin | undefined;
    onContainerMouseMove(event: MouseEvent): void;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
    onReadonlyChange(readonly: boolean): void;
}
