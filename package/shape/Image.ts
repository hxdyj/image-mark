import { G, Image } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
import { ImageMark } from "..";


export interface ImageData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	src: string
	shapeName: 'image'
}

export class ImageMarkImage extends ImageMarkShape<ImageData> {
	constructor(data: ImageData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options, new G())
		// this.shapeInstance.load(this.data.src)
		// this.draw()
	}

	draw(): G {
		// this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y)
		return this.shapeInstance
	}

	updateData(): G {
		return this.shapeInstance
	}
}
