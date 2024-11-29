import { EventBindingThis } from '../event';
import { ImageMarkShape } from '../shape/Shape';
import { default as ImageMark } from '..';
import { ShapePlugin } from '#/plugins/ShapePlugin';
export declare class Action extends EventBindingThis {
    protected imageMark: ImageMark;
    protected shape: ImageMarkShape;
    protected options?: any;
    static actionName: string;
    static actionOptions: {
        [key: string]: any;
    };
    constructor(imageMark: ImageMark, shape: ImageMarkShape, options?: any);
    beforeActionRemove(): void;
    destroy(): void;
    protected getShapePlugin(): ShapePlugin | undefined;
}
