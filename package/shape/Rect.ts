import { G, Point, Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
}

export function getBoundingBoxByTwoPoints(point1: Point, point2: Point): BoundingBox {
	const xMin = Math.min(point1.x, point2.x);
	const xMax = Math.max(point1.x, point2.x);
	const yMin = Math.min(point1.y, point2.y);
	const yMax = Math.max(point1.y, point2.y);
	return {
		x: xMin,
		y: yMin,
		width: xMax - xMin,
		height: yMax - yMin,
	};
}

export class ImageMarkRect extends ImageMarkShape<RectData> {
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
			rect.size(width, height).fill('transparent').stroke({ width: 10, color: '#FADC19' })
		}
		return this.shapeInstance
	}

	updateData(newData: RectData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): RectData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const newRect: RectData = {
			...this.data,
			...getBoundingBoxByTwoPoints(startPoint, endPoint),
		}
		return newRect
	}
}
