import { Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
}

export class ImageMarkRect extends ImageMarkShape<RectData, Rect> {
	static shapeName = "rect"

	constructor(data: RectData, imageMarkInstance: ImageMark) {
		super(data, imageMarkInstance, new Rect())
		this.draw()
	}

	draw(): Rect {
		this.shapeInstance.size(100, 100).fill('rgba(29,33,41,0.8)')
		return this.shapeInstance
	}
}
