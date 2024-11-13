import { G, Point, Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
}

function getBoundingBoxByTwoPoints(point1: Point, point2: Point): BoundingBox {
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

	draw(newData?: RectData): G {
		const { x, y, width, height } = newData || this.data
		this.shapeInstance.move(x, y)
		const rect = this.shapeInstance.findOne('rect') as Rect
		if (rect) {
			rect.size(width, height).fill('transparent').stroke({ width: 5, color: '#F53F3F' })
		}
		return this.shapeInstance
	}

	updateData(newData: RectData): G {
		this.draw(newData)
		this.data = newData
		return this.shapeInstance
	}

	mouseEvent2Data(eventList: MouseEvent[]): RectData | null {
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
