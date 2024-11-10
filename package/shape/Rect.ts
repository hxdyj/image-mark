import { G, Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
}

export class ImageMarkRect extends ImageMarkShape<RectData, G> {
	static shapeName = "rect"

	constructor(data: RectData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		const rect = new Rect()
		group.add(rect)
		super(data, imageMarkInstance, options, group)
		this.draw()
	}

	draw(): G {
		const { x, y, width, height } = this.data
		this.shapeInstance.move(x, y)
		const rect = this.shapeInstance.findOne('rect') as Rect
		if (rect) {
			rect.size(width, height).fill('transparent').stroke({ width: 5, color: '#F53F3F' })
		}
		return this.shapeInstance
	}
}
