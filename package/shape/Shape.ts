import { Shape } from "@svgdotjs/svg.js";
import { ImageMark } from "../index";

export abstract class ImageMarkShape {
	abstract shapeInstance: Shape;
	private isRendered = false
	static shapeName: string
	imageMark: ImageMark;

	constructor(protected data: ShapeData, imageMarkInstance: ImageMark) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
		this.imageMark = imageMarkInstance;
	}
	abstract draw(): Shape;
	render(stage: Parameters<InstanceType<typeof Shape>['addTo']>[0]): void {
		if (!this.isRendered) {
			this.shapeInstance.addTo(stage)
			this.isRendered = true
		}
	}
}


export interface ShapeData {
	shapeName: string
	[x: string]: any
}

