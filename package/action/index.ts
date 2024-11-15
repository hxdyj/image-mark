import { Shape } from "@svgdotjs/svg.js";
import { EventBindingThis } from "../event";
import { ImageMarkShape } from "../shape/Shape";
import ImageMark from "..";
import { ShapePlugin } from "#/plugins/ShapePlugin";

export class Action extends EventBindingThis {
	static actionName: string;
	static actionOptions: {
		[key: string]: any
	} = {};
	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: any) {
		super()
	}

	beforeActionRemove() { }

	destroy() { }

	protected getShapePlugin(): ShapePlugin | undefined {
		const shapeInstance = this.imageMark.plugin[ShapePlugin.pluginName] as ShapePlugin
		return shapeInstance
	}
}
