import { ImageMark } from '..';
import { EventBindingThis } from '../event/event';
export declare class Plugin extends EventBindingThis {
    static pluginName: string;
    imageMark: ImageMark;
    constructor(imageMarkInstance: ImageMark);
    bindEvent(): void;
    unbindEvent(): void;
    onInit(): void;
    getThisPluginOptions<T>(): T;
    destroy(): void;
}
