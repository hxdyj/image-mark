import { Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeType } from "./Shape";


export interface RectData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	type: ShapeType.Rect
}

export class ImageMarkRect extends ImageMarkShape {
	shapeInstance: Rect
	constructor(data: RectData) {
		super(data)
		this.shapeInstance = new Rect()
		this.draw()
	}
	draw(): Rect {
		this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y).fill('rgba(29,33,41,0.8)')
		return this.shapeInstance
	}
}
