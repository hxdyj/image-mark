import { default as ImageMark } from '../index';
import { Plugin } from './plugin';
import { DeepPartial } from 'utility-types';
import { SelectionType } from './SelectionPlugin';
export type ShortKeyValue = {
    keyName: string;
    hotkeyName?: string;
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
    drawing_pan_mode: ShortKeyValue;
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
    multiple_select_mode: ShortKeyValue;
};
export type ShortcutPluginOptions = {
    autoActive: boolean;
    keyMap: ShortcutKeyMap;
};
export type KeyType = keyof ShortcutKeyMap;
export declare class ShortcutPlugin extends Plugin {
    pluginOptions?: DeepPartial<ShortcutPluginOptions> | undefined;
    static pluginName: string;
    constructor(imageMarkInstance: ImageMark, pluginOptions?: DeepPartial<ShortcutPluginOptions> | undefined);
    autoActived: boolean;
    disableKeyList: Set<KeyType>;
    disableKeys(nameList: Array<KeyType>): void;
    enableKeys(nameList: Array<KeyType>): void;
    onContainerMouseOver(event: MouseEvent): void;
    onShortcutAutoActive(scopeName: string): void;
    bindEvent(): void;
    unbindEvent(): void;
    getScopeName(): string;
    activeScope(): void;
    eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent, value: ShortKeyValue): void;
    protected multiple_select_mode_keydown: boolean;
    protected multiple_select_mode_pre_mode: SelectionType | null;
    protected drawing_pan_mode_active: boolean;
    protected drawing_pan_start_point: [number, number] | null;
    onDrawingPanMouseDown(event: MouseEvent): void;
    onDrawingPanMouseMove(event: MouseEvent): void;
    onDrawingPanMouseUp(event: MouseEvent): void;
    endDrawingPan(): void;
    bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>): void;
    unbindKeyMap(): void;
    getShorcutPluginOptions(options?: DeepPartial<ShortcutPluginOptions>): ShortcutPluginOptions;
    destroy(): void;
}
