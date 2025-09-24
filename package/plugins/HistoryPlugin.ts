import { ImageMarkShape, ShapeData } from "../shape/Shape";
import ImageMark, { ArrayPoint, EventBusEventName } from "../index";
import { Plugin } from "./plugin";
import { cloneDeep } from "lodash-es";

export type HistoryPluginOptions = {

}

export class HistoryPlugin extends Plugin {
	static pluginName = "history";
	stack: History[] = []
	redoStack: History[] = []
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// const thisPlugin = this.getThisPluginOptions<HistoryPluginOptions>()
		this.bindEventThis([
			'onShapeAdd',
			'onShapeDelete',
			'onShapeStartMove',
			'onShapeEndMove',
			'onShapeStartEdit',
			'onShapeEndEdit'
		])
		this.bindEvent()
	}

	getStackInfo() {
		return {
			undo: this.stack.length,
			redo: this.redoStack.length
		}
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.on(EventBusEventName.shape_start_move, this.onShapeStartMove)
		this.imageMark.on(EventBusEventName.shape_end_move, this.onShapeEndMove)
		this.imageMark.on(EventBusEventName.shape_add, this.onShapeAdd)
		this.imageMark.on(EventBusEventName.shape_delete, this.onShapeDelete)
		this.imageMark.on(EventBusEventName.shape_start_edit, this.onShapeStartEdit)
		this.imageMark.on(EventBusEventName.shape_end_edit, this.onShapeEndEdit)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.shape_start_move, this.onShapeStartMove)
		this.imageMark.off(EventBusEventName.shape_end_move, this.onShapeEndMove)
		this.imageMark.off(EventBusEventName.shape_add, this.onShapeAdd)
		this.imageMark.off(EventBusEventName.shape_delete, this.onShapeDelete)
		this.imageMark.off(EventBusEventName.shape_start_edit, this.onShapeStartEdit)
		this.imageMark.off(EventBusEventName.shape_end_edit, this.onShapeEndEdit)
	}

	tmpHistory: History | null = null

	emitHistoryChange() {
		this.imageMark.eventBus.emit(EventBusEventName.history_change, this.getStackInfo(), this.imageMark)
	}

	push(history: History, clear = true) {
		this.stack.push(history)
		if (clear) {
			this.redoStack = []
		}
		this.emitHistoryChange()
	}

	undo() {
		const history = this.stack.pop() || null
		if (history) {
			history.undo(this.imageMark)
			this.redoStack.push(history)
			this.emitHistoryChange()
		}
	}

	redo() {
		const history = this.redoStack.pop() || null
		if (history) {
			history.redo(this.imageMark)
			this.push(history, false)
			this.emitHistoryChange()
		}
	}

	onShapeAdd(data: ShapeData) {
		this.push(new ShapeExistHistory(undefined, data))
	}


	onShapeDelete(data: ShapeData) {
		this.push(new ShapeExistHistory(data, undefined))
	}

	onShapeStartMove(shape: ImageMarkShape) {
		this.tmpHistory = new ShapeEditHistory(shape.data)
	}

	onShapeEndMove(shape: ImageMarkShape, diff: ArrayPoint) {
		if (this.tmpHistory && !(diff.every(i => i == 0))) {
			this.tmpHistory.setNewData(shape.data)
			this.push(this.tmpHistory)
			this.tmpHistory = null
		}
	}

	onShapeStartEdit(shape: ImageMarkShape) {
		this.tmpHistory = new ShapeEditHistory(shape.data)
	}

	onShapeEndEdit(shape: ImageMarkShape) {
		if (this.tmpHistory) {
			this.tmpHistory.setNewData(shape.data)
			this.push(this.tmpHistory)
			this.tmpHistory = null
		}
	}

	destroy(): void {
		this.clear()
		this.unbindEvent()
		super.destroy()
	}

	clear() {
		this.stack = []
		this.redoStack = []
		this.emitHistoryChange()
	}
}


export abstract class History<T extends object | number | string = object> {
	static operate: string
	oldData: T | undefined
	newData: T | undefined
	constructor(oldData?: T, newData?: T) {
		this.oldData = cloneDeep(oldData)
		this.newData = cloneDeep(newData)
	}
	setOldData(oldData: T) {
		this.oldData = cloneDeep(oldData)
	}
	setNewData(newData: T) {
		this.newData = cloneDeep(newData)
	}
	abstract undo(imageMarkInstance: ImageMark): void
	abstract redo(imageMarkInstance: ImageMark): void
}

export class ShapeEditHistory extends History<ShapeData> {
	static operate = 'edit'
	constructor(oldData?: ShapeData, newData?: ShapeData) {
		super(oldData, newData)
	}
	undo(imageMark: ImageMark): void {
		if (this.newData && this.oldData) {
			const shapeInstance = imageMark.getShapePlugin()?.getInstanceByData(this.newData)
			shapeInstance?.updateData(this.oldData)
		}
	}
	redo(imageMark: ImageMark): void {
		if (this.newData && this.oldData) {
			const shapeInstance = imageMark.getShapePlugin()?.getInstanceByData(this.oldData)
			shapeInstance?.updateData(this.newData)
		}
	}
}

export class ShapeExistHistory extends History<ShapeData> {
	static operate = 'exist'
	constructor(oldData?: ShapeData, newData?: ShapeData) {
		super(oldData, newData)
	}
	undo(imageMark: ImageMark): void {
		if (this.oldData) {
			imageMark.getShapePlugin()?.onAdd(this.oldData, false)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.onDelete(this.newData)
		}
	}
	redo(imageMark: ImageMark): void {
		if (this.oldData) {
			imageMark.getShapePlugin()?.onDelete(this.oldData)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.onAdd(this.newData, false)
		}
	}
}
