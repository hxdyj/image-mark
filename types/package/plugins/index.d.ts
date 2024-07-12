import { ImageMark } from '..';
import { EventBindingThis } from '../event';

export declare class Plugin extends EventBindingThis {
    static pluginName: string;
    imageMark: ImageMark;
    constructor(imageMarkInstance: ImageMark);
    beforePluginRemove(): void;
}
