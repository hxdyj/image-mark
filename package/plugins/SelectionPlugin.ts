import { ImageMark } from "..";
import { Plugin } from "./plugin";
import { ImageMarkShape } from "../shape/Shape";
import { SelectionAction } from "../action/SelectionAction";
import { EventBusEventName } from "../event/const";
import { cloneDeep } from 'lodash-es';

export type SelectionPluginOptions = {
}

export type SelectionType = 'single' | 'multiple'

export class SelectionPlugin extends Plugin {
	static pluginName = "selection";
	selectShapeList: ImageMarkShape[] = []
	private _mode: SelectionType = 'single'

	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.bindEventThis(['onSelectionActionClick', 'onShapeAfterRender'])
		this.bindEvent()
	}


	onShapeAfterRender(shapeInstance: ImageMarkShape) {
		if (!shapeInstance.action[SelectionAction.actionName]) {
			shapeInstance.addAction(SelectionAction)
		}
	}


	mode(newMode?: SelectionType) {
		if (!newMode) return this._mode
		this._mode = newMode
		return this._mode
	}

	onSelectionActionClick(shape: ImageMarkShape) {
		const selectionActoin = this.getSelectionAction(shape)
		if (this.mode() === 'single') {
			if (selectionActoin?.selected) {
				this.clear()
			} else {
				this.clear()
				this.selectShape(shape)
			}
		} else {
			if (selectionActoin?.selected) {
				this.unselectShape(shape)
			} else {
				this.selectShape(shape)
			}
		}
	}

	getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined {
		return shape.action[SelectionAction.actionName] as SelectionAction | undefined
	}

	selectShape(shape: ImageMarkShape) {
		this.selectShapes([shape])
	}

	selectShapes(shapeList: ImageMarkShape[]) {
		shapeList.forEach(shape => {
			const selectionActoin = this.getSelectionAction(shape)
			if (!selectionActoin) return console.error('shape has no selection action')

			if (!selectionActoin.selected) {
				this.selectShapeList.push(shape)
			}
			selectionActoin.enableSelection()

		})
		this.imageMark.eventBus.emit(EventBusEventName.selection_select_list_change, this.selectShapeList)
	}

	unselectShape(shape: ImageMarkShape) {
		this.unselectShapes([shape])
	}

	unselectShapes(shapeList: ImageMarkShape[]) {
		shapeList.slice().forEach(shape => {
			const selectionActoin = this.getSelectionAction(shape)
			if (!selectionActoin) return console.error('shape has no selection action')

			if (selectionActoin.selected) {
				this.selectShapeList.splice(this.selectShapeList.indexOf(shape), 1)
			}
			selectionActoin.disableSelection()
		})
		this.imageMark.eventBus.emit(EventBusEventName.selection_select_list_change, this.selectShapeList)
	}

	clear() {
		console.log(`clear selection`, cloneDeep(this.selectShapeList))
		this.unselectShapes(this.selectShapeList)
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.on(EventBusEventName.shape_after_render, this.onShapeAfterRender)
		this.imageMark.on(EventBusEventName.selection_action_click, this.onSelectionActionClick)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.selection_action_click, this.onSelectionActionClick)
	}

	destroy(): void {
		this.unbindEvent()
		super.destroy()
	}
}
