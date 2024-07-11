import { Shape, Svg } from "@svgdotjs/svg.js";
import { BoundingBox } from "..";

export abstract class ImageMarkShape {
	abstract shapeInstance: Shape;
	private isRendered = false
	constructor(protected data: ShapeData) { }
	abstract draw(): Shape;
	render(stage: Parameters<InstanceType<typeof Shape>['addTo']>[0]): void {
		if (!this.isRendered) {
			this.shapeInstance.addTo(stage)
			this.isRendered = true
		}
	}
}

export enum ShapeType {
	Rect = 'rect',
	Image = 'image'
}

export interface ShapeData {
	type: string | ShapeType
	[x: string]: any
}

