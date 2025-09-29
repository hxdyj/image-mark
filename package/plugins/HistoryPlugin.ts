import { ImageMarkShape, ShapeData } from "../shape/Shape";
import ImageMark, { ArrayPoint, EventBusEventName } from "../index";
import { Plugin } from "./plugin";
import { cloneDeep } from "lodash-es";
import { DeepPartial } from "utility-types";

export type HistoryPluginOptions = {

}

export class HistoryPlugin extends Plugin {
	static pluginName = "history";
	stack: History[] = []
	redoStack: History[] = []
	constructor(imageMarkInstance: ImageMark, public pluginOptions?: DeepPartial<HistoryPluginOptions>) {
		super(imageMarkInstance, pluginOptions);
		this.bindEventThis([
			'onShapeAdd',
			'onShapeDelete',
			'onShapeDeletePatch',
			'onShapeDeleteAll',
			'onShapeStartMove',
			'onShapeEndMove',
			'onShapeStartEdit',
			'onShapeEndEdit'
		])
		this.bindEvent()
	}

	getHistoryPluginOptions(options?: DeepPartial<HistoryPluginOptions>) {
		return this.getOptions(options) as HistoryPluginOptions
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
		this.imageMark.on(EventBusEventName.shape_delete_all, this.onShapeDeleteAll)
		this.imageMark.on(EventBusEventName.shape_delete_patch, this.onShapeDeletePatch)
		this.imageMark.on(EventBusEventName.shape_start_edit, this.onShapeStartEdit)
		this.imageMark.on(EventBusEventName.shape_end_edit, this.onShapeEndEdit)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.shape_start_move, this.onShapeStartMove)
		this.imageMark.off(EventBusEventName.shape_end_move, this.onShapeEndMove)
		this.imageMark.off(EventBusEventName.shape_add, this.onShapeAdd)
		this.imageMark.off(EventBusEventName.shape_delete, this.onShapeDelete)
		this.imageMark.off(EventBusEventName.shape_delete_all, this.onShapeDeleteAll)
		this.imageMark.off(EventBusEventName.shape_delete_patch, this.onShapeDeletePatch)
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
		this.push(new ShapeExistHistory(data))
	}

	onShapeDeletePatch(dataList: ShapeData[]) {
		this.push(new ShapePatchExistHistory(dataList))
	}

	onShapeDeleteAll(dataList: ShapeData[]) {
		this.push(new ShapePatchExistHistory(dataList))
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
		console.log(111, cloneDeep(shape.data))
	}

	onShapeEndEdit(shape: ImageMarkShape) {
		if (this.tmpHistory) {
			this.tmpHistory.setNewData(shape.data)
			console.log(222, cloneDeep(shape.data))
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
			imageMark.getShapePlugin()?.addNode(this.oldData, false)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.removeNode(this.newData, false)
		}
	}
	redo(imageMark: ImageMark): void {
		if (this.oldData) {
			imageMark.getShapePlugin()?.removeNode(this.oldData, false)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.addNode(this.newData, false)
		}
	}
}

export class ShapePatchExistHistory extends History<ShapeData[]> {
	static operate = 'patch_exist'
	constructor(oldData?: ShapeData[], newData?: ShapeData[]) {
		super(oldData, newData)
	}
	undo(imageMark: ImageMark): void {
		if (this.oldData) {
			imageMark.getShapePlugin()?.addNodes(this.oldData, false)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.removeNodes(this.newData, false)
		}
	}
	redo(imageMark: ImageMark): void {
		if (this.oldData) {
			imageMark.getShapePlugin()?.removeNodes(this.oldData, false)
		}
		if (this.newData) {
			imageMark.getShapePlugin()?.addNodes(this.newData, false)
		}
	}
}
