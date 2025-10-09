import { EventBindingThis } from '../event/event';
import { ImageMarkShape } from '../shape/Shape';
import { default as ImageMark } from '..';
export type ActionOptions = {
    [key: string]: any;
};
export declare class Action extends EventBindingThis {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: any | undefined;
    static actionName: string;
    static actionOptions: ActionOptions;
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: any | undefined);
    destroy(): void;
    getOptions<T extends ActionOptions = ActionOptions>(options?: T): T;
    onContainerMouseMove(event: MouseEvent): void;
    onDocumentMouseMove(event: MouseEvent): void;
    onDocumentMouseUp(event: MouseEvent): void;
    onReadonlyChange(readonly: boolean): void;
}
