import { Shape } from "@svgdotjs/svg.js";
import { EventBindingThis } from "../event/event";
import { ImageMarkShape, ShapeData } from "../shape/Shape";
import ImageMark from "..";
import { ShapePlugin } from "../plugins/ShapePlugin";

export class Action extends EventBindingThis {
	static actionName: string;
	static actionOptions: {
		[key: string]: any
	} = {};
	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: any) {
		super()
	}

	destroy() {
		const shapePlugin = this.getShapePlugin()
		//@ts-ignore
		const actionName = this.constructor.actionName
		const shapeInstance = shapePlugin?.getInstanceByData(this.shape.data)
		if (shapeInstance) {
			delete shapeInstance.action[actionName]
		}
	}

	protected getShapePlugin(): ShapePlugin | undefined {
		const shapeInstance = this.imageMark.plugin[ShapePlugin.pluginName] as ShapePlugin
		return shapeInstance
	}

	onContainerMouseMove(event: MouseEvent) { }
	onDocumentMouseMove(event: MouseEvent) { }
	onDocumentMouseUp(event: MouseEvent) { }
}
