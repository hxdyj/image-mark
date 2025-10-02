import ImageMark, { ImageMarkCircle, ImageMarkDot, imageMarkGlobalEventBus, ImageMarkLine, ImageMarkPathLine, ImageMarkPolygon, ImageMarkPolyLine, ImageMarkRect, LmbMoveAction } from "../index";
import { Plugin } from "./plugin";
import hotkeys from "hotkeys-js";
import { DeepPartial } from 'utility-types';
import { GlobalEventBusEventName } from "../event/const";
import { SelectionType } from "./SelectionPlugin";

let imageMarkHotkeys = new Proxy(hotkeys, {
	get(target, prop, receiver) {
		if (prop === 'setScope') {
			return (scopeName: string) => {
				target.setScope.call(receiver, scopeName)
				const currentScopeName = imageMarkHotkeys.getScope()
				imageMarkGlobalEventBus.emit(GlobalEventBusEventName.shortcut_auto_active, currentScopeName)
			}
		}
		return Reflect.get(target, prop, receiver)
	}
})

export type ShortKeyValue = {
	keyName: string
	hotkeyName?: string
	hotkeyOptions?: {
		element?: HTMLElement | null;
		keyup?: boolean | null;
		keydown?: boolean | null;
		capture?: boolean
		splitKey?: string;
		single?: boolean;
	}
}

export type ShortcutKeyMap = {
	delete_shape: ShortKeyValue  //删除shape（选中时） 默认 backspace
	delete_all_shape: ShortKeyValue //删除所有shape 默认 ctrl/command + backspace

	move_mode: ShortKeyValue //整体改为移动模式，就是禁用了shape直接能移动 ，默认按着 space 为移动模式（就像蓝湖这种）

	draw_dot: ShortKeyValue //绘制矩形, 默认 alt/option + 1
	draw_line: ShortKeyValue //绘制矩形, 默认 alt/option + 2
	draw_pathline: ShortKeyValue //绘制路径, 默认 alt/option + 3
	draw_polyline: ShortKeyValue //绘制折线, 默认 alt/option + 4
	draw_rect: ShortKeyValue //绘制矩形, 默认 alt/option + 5
	draw_circle: ShortKeyValue //绘制矩形, 默认 alt/option + 6
	draw_polygon: ShortKeyValue //绘制多边形, 默认 alt/option + 7

	drawing_delete_point: ShortKeyValue //绘制时删除点, 默认 backspace
	end_drawing: ShortKeyValue //结束绘制, 默认 esc
	confirm_draw: ShortKeyValue //确定绘制, 默认 enter

	undo: ShortKeyValue //撤销, 默认 ctrl/command + z
	redo: ShortKeyValue //重做, 默认 ctrl/command + y

	multiple_select_mode: ShortKeyValue // 多选模式   这里仅支持设置 cmd | command | ctrl | command | shift 这几个值   默认 ctrl/command + click
}


export type ShortcutPluginOptions = {
	autoActive: boolean
	keyMap: ShortcutKeyMap
}


const defaultShortcutPluginOptions: ShortcutPluginOptions = {
	autoActive: true,
	keyMap: {
		delete_shape: {
			keyName: 'backspace',
		},
		delete_all_shape: {
			keyName: 'ctrl+backspace,command+backspace',
		},
		move_mode: {
			keyName: 'space',
			hotkeyOptions: {
				keyup: true,
				keydown: true
			}
		},
		draw_dot: {
			keyName: 'alt+1,option+1',
		},
		draw_line: {
			keyName: 'alt+2,option+2',
		},
		draw_pathline: {
			keyName: 'alt+3,option+3',
		},
		draw_polyline: {
			keyName: 'alt+4,option+4',
		},
		draw_rect: {
			keyName: 'alt+5,option+5',
		},
		draw_circle: {
			keyName: 'alt+6,option+6'
		},
		draw_polygon: {
			keyName: 'alt+7,option+7'
		},
		drawing_delete_point: {
			keyName: 'backspace'
		},
		end_drawing: {
			keyName: 'esc'
		},
		confirm_draw: {
			keyName: 'enter'
		},
		undo: {
			keyName: 'ctrl+z,command+z',
		},
		redo: {
			keyName: 'ctrl+y,command+y'
		},
		multiple_select_mode: {
			keyName: 'ctrl,command',
			hotkeyName: '*',
			hotkeyOptions: {
				keydown: true,
				keyup: true,
				single: true
			}
		}
	}
}
export type KeyType = keyof ShortcutKeyMap

export class ShortcutPlugin extends Plugin {
	static pluginName = "shortcut";

	constructor(imageMarkInstance: ImageMark, public pluginOptions?: DeepPartial<ShortcutPluginOptions>) {
		super(imageMarkInstance, pluginOptions)
		this.bindEventThis([
			'onContainerMouseOver',
			'onShortcutAutoActive'
		])
		this.bindEvent()
		this.bindKeyMap()
	}

	autoActived = false

	disableKeyList: Set<KeyType> = new Set()

	disableKeys(nameList: Array<KeyType>) {
		nameList.forEach(name => {
			imageMarkHotkeys.unbind(name, this.getScopeName())
			this.disableKeyList.add(name)
		})
	}

	enableKeys(nameList: Array<KeyType>) {
		nameList.forEach(name => {
			if (this.disableKeyList.has(name)) {
				this.disableKeyList.delete(name)
			}
		})
	}

	onContainerMouseOver(event: MouseEvent) {
		const { autoActive } = this.getShorcutPluginOptions()
		if (!autoActive) return
		if (this.autoActived) return
		this.activeScope()
		this.autoActived = true
		console.log('auto active scope', this.getScopeName())
	}

	onShortcutAutoActive(scopeName: string) {
		if (scopeName !== this.getScopeName()) {
			this.autoActived = false
		}
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.container.addEventListener('mouseover', this.onContainerMouseOver)
		this.imageMark.globalEventBus.on(GlobalEventBusEventName.shortcut_auto_active, this.onShortcutAutoActive)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.container.removeEventListener('mouseover', this.onContainerMouseOver)
		this.imageMark.globalEventBus.off(GlobalEventBusEventName.shortcut_auto_active, this.onShortcutAutoActive)
	}

	getScopeName() {
		return this.imageMark.id
	}

	activeScope() {
		imageMarkHotkeys.setScope(this.getScopeName())
	}

	eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent, value: ShortKeyValue) {
		if (this.disableKeyList.has(keyName)) return
		if (
			this.imageMark.options.readonly &&
			[
				'delete_shape',
				'delete_all_shape',
				'draw_dot',
				'draw_line',
				'draw_pathline',
				'draw_polyline',
				'draw_rect',
				'draw_circle',
				'draw_polygon',
				'drawing_delete_point',
				'end_drawing',
				'confirm_draw',
				'undo',
				'redo',
			].includes(keyName)) return

		const handler = {
			delete_shape: (event: KeyboardEvent) => {
				if (!this.imageMark.status.drawing && !this.imageMark.status.editing) {
					const list = this.imageMark.getSelectionPlugin()?.selectShapeList ?? []
					this.imageMark.getShapePlugin()?.removeNodes(list)
				}
			},
			delete_all_shape: (event: KeyboardEvent) => {
				event.preventDefault()
				this.imageMark.getShapePlugin()?.removeAllNodes()
			},
			move_mode: (event: KeyboardEvent) => {
				event.preventDefault()
				const shapePlugin = this.imageMark.getShapePlugin()
				if (!shapePlugin) return
				if (event.type === 'keydown') {
					shapePlugin.disableAction(LmbMoveAction.actionName)
				}
				if (event.type === 'keyup') {
					shapePlugin.enableAction(LmbMoveAction.actionName)
				}
			},
			draw_dot: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkDot({
					shapeName: 'dot',
					x: 0,
					y: 0,
					r: 0,
				}, this.imageMark))
			},
			draw_line: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkLine({
					shapeName: 'line',
					x: 0,
					y: 0,
					x2: 0,
					y2: 0,
				}, this.imageMark))
			},
			draw_pathline: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkPathLine({
					shapeName: 'pathline',
					points: []
				}, this.imageMark))
			},
			draw_polyline: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkPolyLine({
					shapeName: 'polyline',
					points: []
				}, this.imageMark))
			},
			draw_rect: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkRect({
					shapeName: 'rect',
					x: 0,
					y: 0,
					width: 0,
					height: 0,
				}, this.imageMark))
			},
			draw_circle: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkCircle({
					shapeName: 'circle',
					x: 0,
					y: 0,
					r: 0,
				}, this.imageMark))
			},
			draw_polygon: (event: KeyboardEvent) => {
				this.imageMark.getShapePlugin()?.startDrawing(new ImageMarkPolygon({
					shapeName: 'polygon',
					points: []
				}, this.imageMark))
			},
			drawing_delete_point: (event: KeyboardEvent) => {
				if (this.imageMark.status.drawing) {
					this.imageMark.getShapePlugin()?.dropLastMouseTrace()
				}
			},
			end_drawing: (event: KeyboardEvent) => {
				if (this.imageMark.status.drawing) {
					this.imageMark.getShapePlugin()?.endDrawing(true)
				}
			},
			confirm_draw: (event: KeyboardEvent) => {
				event.preventDefault()
				if (this.imageMark.status.drawing) {
					this.imageMark.getShapePlugin()?.endDrawing()
				}
			},
			undo: (event: KeyboardEvent) => {
				event.preventDefault()
				this.imageMark.getHistoryPlugin()?.undo()
			},
			redo: (event: KeyboardEvent) => {
				event.preventDefault()
				this.imageMark.getHistoryPlugin()?.redo()
			},
			multiple_select_mode: (event: KeyboardEvent) => {
				const selectionPlugin = this.imageMark.getSelectionPlugin()
				if (!selectionPlugin) return
				const keyList = value.keyName.split(',')

				//@ts-ignore
				const isKeyExist = keyList.some(keyName => hotkeys[keyName])

				if (!this.multiple_select_mode_keydown && isKeyExist && event.type === 'keydown') {
					this.multiple_select_mode_pre_mode = selectionPlugin?.mode() || 'single'
					selectionPlugin.mode('multiple')
					this.multiple_select_mode_keydown = true
				}

				if (this.multiple_select_mode_keydown && event.type === 'keyup') {
					selectionPlugin.mode(this.multiple_select_mode_pre_mode || 'single')
					this.multiple_select_mode_keydown = false
					this.multiple_select_mode_pre_mode = null
				}
			}
		}[keyName]

		handler?.(event)
	}

	protected multiple_select_mode_keydown = false
	protected multiple_select_mode_pre_mode: SelectionType | null = null

	bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>) {
		const keyMap = this.getShorcutPluginOptions(options).keyMap
		Object.entries(keyMap).forEach(([key, value]) => {
			if (!this.disableKeyList.has(key as KeyType)) {
				imageMarkHotkeys(value.hotkeyName || value.keyName, {
					...value.hotkeyOptions,
					scope: this.getScopeName(),
				}, e => {
					this.eventCaller(key as keyof ShortcutKeyMap, e, value)
				})
			}
		})
	}

	unbindKeyMap() {
		imageMarkHotkeys.deleteScope(this.getScopeName())
		if (imageMarkHotkeys.getScope() == this.getScopeName()) {
			imageMarkHotkeys.setScope('')
		}
	}

	getShorcutPluginOptions(options?: DeepPartial<ShortcutPluginOptions>) {
		return this.getOptions(options || defaultShortcutPluginOptions) as ShortcutPluginOptions
	}

	destroy(): void {
		this.unbindEvent()
		super.destroy()
	}
}
