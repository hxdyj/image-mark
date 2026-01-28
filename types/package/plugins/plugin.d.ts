import { ImageMark } from '..';
import { EventBindingThis } from '../event/event';
export type PluginOptions = {
    [key: string]: any;
};
export declare class Plugin extends EventBindingThis {
    pluginOptions?: PluginOptions | undefined;
    static pluginName: string;
    static pluginOptions: PluginOptions;
    imageMark: ImageMark;
    constructor(imageMarkInstance: ImageMark, pluginOptions?: PluginOptions | undefined);
    getOptions<T extends PluginOptions = PluginOptions>(options?: T, dealPluginOptions?: (options: T) => T): T;
    setOptions<T extends PluginOptions = PluginOptions>(options: T): void;
    bindEvent(): void;
    unbindEvent(): void;
    onInit(): void;
    onReadonlyChange(readonly: boolean): void;
    destroy(): void;
}
