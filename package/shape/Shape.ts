import { Shape } from "@svgdotjs/svg.js";

export abstract class ImageMarkShape {
	abstract shapeInstance: Shape;
	private isRendered = false
	static shapeName: string
	constructor(protected data: ShapeData) {
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.shapeName) {
			throw new Error(`${constructor.name} must have a static property 'shapeName'`);
		}
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

