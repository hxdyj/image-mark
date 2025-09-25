import ImageMark, { ImageMarkCircle, ImageMarkDot, ImageMarkLine, ImageMarkPathLine, ImageMarkPolygon, ImageMarkPolyLine, ImageMarkRect, LmbMoveAction } from "../index";
import { Plugin } from "./plugin";
import { defaultsDeep } from "lodash-es";
import hotkeys from "hotkeys-js";
import { DeepPartial } from 'utility-types';

export type ShortKeyValue = {
	keyName: string
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
			keyName: 'ctrl+backspace',
		},
		move_mode: {
			keyName: 'space',
			hotkeyOptions: {
				keyup: true
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
	}
}

export class ShortcutPlugin extends Plugin {
	static pluginName = "shortcut";

	constructor(imageMarkInstance: ImageMark, public options?: DeepPartial<ShortcutPluginOptions>) {
		super(imageMarkInstance)
		this.bindEventThis([
			'onContainerMouseOver',
			'onContainerMouseLeave',
		])
		this.bindEvent()
		this.bindKeyMap()
	}

	autoActived = false

	onContainerMouseOver(event: MouseEvent) {
		const { autoActive } = this.getOptions()
		if (!autoActive) return
		if (this.autoActived) return
		this.activeScope()
		this.autoActived = true
	}

	onContainerMouseLeave(event: MouseEvent) {
		const { autoActive } = this.getOptions()
		if (!autoActive) return
		hotkeys.setScope('')
		this.autoActived = false
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.container.addEventListener('mouseover', this.onContainerMouseOver)
		this.imageMark.container.addEventListener('mouseleave', this.onContainerMouseLeave)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.container.removeEventListener('mouseover', this.onContainerMouseOver)
		this.imageMark.container.removeEventListener('mouseleave', this.onContainerMouseLeave)
	}

	getScopeName() {
		return this.imageMark.id
	}

	activeScope() {
		hotkeys.setScope(this.getScopeName())
	}

	eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent) {
		const handler = {
			delete_shape: (event: KeyboardEvent) => {
				const list = this.imageMark.getSelectionPlugin()?.selectShapeList ?? []
				list.forEach(item => {
					this.imageMark.getShapePlugin()?.onDelete(item.data)
				})
			},
			delete_all_shape: (event: KeyboardEvent) => {
				event.preventDefault()
				this.imageMark.getShapePlugin()?.clear()
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
		}[keyName]

		handler?.(event)
	}

	bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>) {
		const keyMap = this.getOptions(options).keyMap
		Object.entries(keyMap).forEach(([key, value]) => {
			hotkeys(value.keyName, {
				...value.hotkeyOptions,
				scope: this.getScopeName(),
			}, e => {
				this.eventCaller(key as keyof ShortcutKeyMap, e)
			})
		})
	}

	unbindKeyMap() {
		hotkeys.deleteScope(this.getScopeName())
		if (hotkeys.getScope() == this.getScopeName()) {
			hotkeys.setScope('')
		}
	}

	getOptions(options?: DeepPartial<ShortcutPluginOptions>): ShortcutPluginOptions {
		const thisPluginOptions = this.getThisPluginOptions<ShortcutPluginOptions>()
		return defaultsDeep(options, this.options, thisPluginOptions, defaultShortcutPluginOptions)
	}

	destroy(): void {
		this.unbindEvent()
		super.destroy()
	}
}
