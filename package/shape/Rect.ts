import { Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
}

export class ImageMarkRect extends ImageMarkShape<RectData, Rect> {
	constructor(data: RectData, imageMarkInstance: ImageMark) {
		super(data, imageMarkInstance, new Rect())
		this.draw()
	}
	draw(): Rect {
		this.shapeInstance.size(this.data.width, this.data.height).move(this.data.x, this.data.y).fill('rgba(29,33,41,0.8)')
		return this.shapeInstance
	}
}
