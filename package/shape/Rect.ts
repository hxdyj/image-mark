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
		const { x, y, width, height } = this.data
		this.shapeInstance.move(x, y).size(width, height).fill('none').stroke({ width: 5, color: '#F53F3F' })
		return this.shapeInstance
	}
}
