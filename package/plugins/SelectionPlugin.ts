import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape } from "../shape/Shape";
import { SelectionAction } from "../action/SelectionAction";
import { EventBusEventName } from "#/event/const";

export type SelectionPluginOptions = {
}

export type SelectionType = 'single' | 'multiple'

export class SelectionPlugin extends Plugin {
	static pluginName = "selection";
	protected selectShapeList: ImageMarkShape[] = []
	private _mode: SelectionType = 'single'

	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.bindEventThis(['onSelectionActionClick'])
		this.bindEvent()
	}

	mode(newMode?: SelectionType) {
		if (!newMode) return this._mode
		this._mode = newMode
		return this._mode
	}

	onSelectionActionClick(shape: ImageMarkShape) {
		if (this.mode() === 'single') {
			const selectionActoin = this.getSelectionAction(shape)
			if (selectionActoin?.selected) {
				this.unselectShape(shape)
			} else {
				this.clear()
				this.selectShape(shape)
			}
		}
	}

	getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined {
		return shape.action[SelectionAction.actionName] as SelectionAction | undefined
	}

	selectShape(shape: ImageMarkShape, callAction: boolean = true) {
		this.selectShapes([shape], callAction)
	}

	selectShapes(shapeList: ImageMarkShape[], callAction: boolean = true) {
		const selectShapeList: ImageMarkShape[] = []
		shapeList.forEach(shape => {
			const selectionActoin = this.getSelectionAction(shape)
			if (!selectionActoin) throw new Error('shape has no selection action')

			if (!selectionActoin.selected) {
				this.selectShapeList.push(shape)
				selectShapeList.push(shape)
			}

			callAction && selectionActoin.enableSelection()

			if (selectShapeList.length > 0) {
				//TODO(songle): emit event to update selection
			}
		})
	}

	unselectShape(shape: ImageMarkShape, callAction: boolean = true) {
		this.unselectShapes([shape], callAction)
	}

	unselectShapes(shapeList: ImageMarkShape[], callAction: boolean = true) {
		const unselectShapeList: ImageMarkShape[] = []
		shapeList.forEach(shape => {
			const selectionActoin = this.getSelectionAction(shape)
			if (!selectionActoin) throw new Error('shape has no selection action')

			if (selectionActoin.selected) {
				this.selectShapeList.splice(this.selectShapeList.indexOf(shape), 1)
				unselectShapeList.push(shape)
			}

			callAction && selectionActoin.disableSelection()

			if (unselectShapeList.length > 0) {
				//TODO(songle): emit event to update selection
			}
		})
	}

	clear() {
		this.unselectShapes(this.selectShapeList)
	}

	bindEvent() {
		super.bindEvent()
		this.imageMark.on(EventBusEventName.selection_action_click, this.onSelectionActionClick)
	}

	unbindEvent() {
		super.unbindEvent()
		this.imageMark.off(EventBusEventName.selection_action_click, this.onSelectionActionClick)
	}

	destroy(): void {
		super.destroy()
		this.clear()
		this.unbindEvent()
	}
}
