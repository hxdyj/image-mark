import { Image } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData } from "./Shape";
import { ImageMark } from "..";


export interface ImageData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	src: string
	shapeName: 'image'
}

export class ImageMarkImage extends ImageMarkShape<ImageData, Image> {
	constructor(data: ImageData, imageMarkInstance: ImageMark) {
		super(data, imageMarkInstance, new Image())
		this.shapeInstance.load(this.data.src)
		this.draw()
	}
	draw(): Image {
		this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y)
		return this.shapeInstance
	}
}
