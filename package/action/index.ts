import { Shape } from "@svgdotjs/svg.js";
import { EventBindingThis } from "../event";
import { ImageMarkShape } from "../shape/Shape";
import ImageMark from "..";

export class Action extends EventBindingThis {
	static actionName: string;
	constructor(protected imageMark: ImageMark, protected shape: ImageMarkShape, protected options?: any) {
		super()
	}

	beforeActionRemove() { }

	destroy() { }
}
