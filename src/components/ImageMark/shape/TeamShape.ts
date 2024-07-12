import { Rect } from "@svgdotjs/svg.js";
import { BoundingBox } from "../../../../package";
import { ImageMarkShape, ShapeData } from "../../../../package/shape/Shape";


export interface TeamData extends BoundingBox, ShapeData {
	shapeName: "rect"
}

export class TeamShape extends ImageMarkShape {
	shapeInstance: Rect
	constructor(data: TeamData) {
		super(data)
		this.shapeInstance = new Rect()
		this.draw()
	}
	draw(): Rect {
		this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y).fill('rgba(239,114,0,0.8)')
		return this.shapeInstance
	}
}
