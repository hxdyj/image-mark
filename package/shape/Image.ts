import { Image } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeType } from "./Shape";


export interface ImageData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	src: string
	type: ShapeType.Image
}

export class ImageMarkImage extends ImageMarkShape {
	shapeInstance: Image
	constructor(data: ImageData) {
		super(data)
		this.shapeInstance = new Image()
		this.shapeInstance.load(this.data.src)
		this.draw()
	}
	draw(): Image {
		this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y)
		return this.shapeInstance
	}
}
