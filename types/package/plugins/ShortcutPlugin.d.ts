import { default as ImageMark } from '../index';
import { Plugin } from './plugin';
import { DeepPartial } from 'utility-types';
export type ShortKeyValue = {
    keyName: string;
    hotkeyOptions?: {
        element?: HTMLElement | null;
        keyup?: boolean | null;
        keydown?: boolean | null;
        capture?: boolean;
        splitKey?: string;
        single?: boolean;
    };
};
export type ShortcutKeyMap = {
    delete_shape: ShortKeyValue;
    delete_all_shape: ShortKeyValue;
    move_mode: ShortKeyValue;
    draw_dot: ShortKeyValue;
    draw_line: ShortKeyValue;
    draw_pathline: ShortKeyValue;
    draw_polyline: ShortKeyValue;
    draw_rect: ShortKeyValue;
    draw_circle: ShortKeyValue;
    draw_polygon: ShortKeyValue;
    drawing_delete_point: ShortKeyValue;
    end_drawing: ShortKeyValue;
    confirm_draw: ShortKeyValue;
    undo: ShortKeyValue;
    redo: ShortKeyValue;
};
export type ShortcutPluginOptions = {
    keyMap: ShortcutKeyMap;
};
export declare class ShortcutPlugin extends Plugin {
    options?: DeepPartial<ShortcutPluginOptions> | undefined;
    static pluginName: string;
    constructor(imageMarkInstance: ImageMark, options?: DeepPartial<ShortcutPluginOptions> | undefined);
    autoActived: boolean;
    onContainerMouseOver(event: MouseEvent): void;
    onContainerMouseLeave(event: MouseEvent): void;
    bindEvent(): void;
    unbindEvent(): void;
    getScopeName(): string;
    activeScope(): void;
    eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent): void;
    bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>): void;
    unbindKeyMap(): void;
    getOptions(options?: DeepPartial<ShortcutPluginOptions>): ShortcutPluginOptions;
    destroy(): void;
}
