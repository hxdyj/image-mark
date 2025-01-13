import { ImageMark } from "..";
import { Plugin } from ".";
import { ImageMarkShape } from "../shape/Shape";
import { SelectionAction, SelectType } from "../action/SelectionAction";

export type SelectionPluginOptions = {
}

export class SelectionPlugin extends Plugin {
	static pluginName = "selection";
	protected selectShapeList: ImageMarkShape[] = []

	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		// @ts-ignore
		let pluginName = this.constructor['pluginName']
		this.bindEventThis(['onRerender'])
		this.bindEvent()
	}


	getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined {
		return shape.action[SelectionAction.actionName] as SelectionAction | undefined
	}

	selectShape(shape: ImageMarkShape, selectMode: SelectType = 'click', callAction: boolean = true) {
		this.selectShapes([shape], selectMode, callAction)
	}

	selectShapes(shapeList: ImageMarkShape[], selectMode: SelectType = 'click', callAction: boolean = true) {
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

	unselectShape(shape: ImageMarkShape, selectMode: SelectType = 'click', callAction: boolean = true) {
		this.unselectShapes([shape], selectMode, callAction)
	}

	unselectShapes(shapeList: ImageMarkShape[], selectMode: SelectType = 'click', callAction: boolean = true) {
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
		this.unselectShapes(this.selectShapeList, 'draw-box', true)
		this.selectShapeList = []
	}

	bindEvent() {
		super.bindEvent()
		// this.imageMark.on('shape_delete', this.onDelete)
	}

	unbindEvent() {
		super.unbindEvent()
		// this.imageMark.off('shape_delete', this.onDelete)
	}

	destroy(): void {
		super.destroy()
		this.clear()
		this.unbindEvent()
	}
}
