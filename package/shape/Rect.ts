import { G, Point, Polygon, Rect } from "@svgdotjs/svg.js";
import { getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark, { BoundingBox } from "..";


export interface RectData extends BoundingBox, ShapeData {
	shapeName: "rect",
	x: number,
	y: number,
	width: number,
	height: number,
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
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { x, y, width, height, transform = getDefaultTransform() } = this.data
		const rect = this.getMainShape<Polygon>() || new Polygon()
		rect.id(this.getMainId())

		rect.plot([x, y, x + width, y, x + width, y + height, x, y + height]).size(width, height).fill('transparent').stroke({ width: 10, color: '#FADC19' }).fill('transparent')
		this.shapeInstance.transform(transform.matrix)

		rect.addTo(this.shapeInstance)

		this.drawFuncList.forEach(func => {
			func(this)
		})

		this.options.initDrawFunc?.(this)

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
