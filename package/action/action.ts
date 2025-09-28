import { EventBindingThis } from "../event/event";
import { ImageMarkShape } from "../shape/Shape";
import ImageMark from "..";
import { defaultsDeep } from "lodash-es";


export type ActionOptions = {
	[key: string]: any
}
export class Action extends EventBindingThis {
	static actionName: string;
	static actionOptions: ActionOptions = {}
	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: any) {
		super()
	}

	destroy() {
		const shapePlugin = this.imageMark?.getShapePlugin()
		//@ts-ignore
		const actionName = this.constructor.actionName
		const shapeInstance = shapePlugin?.getInstanceByData(this.shape.data)
		if (shapeInstance) {
			delete shapeInstance.action[actionName]
		}
	}


	getOptions<T extends ActionOptions = ActionOptions>(options?: T): T {
		return defaultsDeep(options, this.options, Object.getPrototypeOf(this).constructor.actionOptions[this.shape.data.shapeName || 'static'])
	}

	onContainerMouseMove(event: MouseEvent) { }
	onDocumentMouseMove(event: MouseEvent) { }
	onDocumentMouseUp(event: MouseEvent) { }
	onReadonlyChange(readonly: boolean) { }
}
