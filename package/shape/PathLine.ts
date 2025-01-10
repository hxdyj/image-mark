import { G, Line, Path, Polygon, Polyline } from "@svgdotjs/svg.js";
import { getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "..";

export interface PathLineData extends ShapeData {
	shapeName: "pathline",
	points: number[],
}

export class ImageMarkPathLine extends ImageMarkShape<PathLineData> {
	static shapeName = "pathline"

	constructor(data: PathLineData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { points, transform = getDefaultTransform() } = this.data
		const path = this.shapeInstance.findOne('path') as Path || new Path()
		path.addTo(this.shapeInstance)
		const d = points.reduce((pre, current, index) => {
			let append = ` ${current}`
			if (index % 2 === 0 && index !== 0) {
				append = ` L${append}`
			}
			return pre + append
		}, points?.length ? 'M' : '')
		path.plot(d).stroke({ width: 10, color: '#FADC19' }).fill('none')
		this.shapeInstance.transform(transform.matrix)
		return this.shapeInstance
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PathLineData | null {
		const { eventList = [] } = options
		if (!eventList.length) return null
		const points = eventList.map(event => {
			const { x, y } = this.imageMark.image.point(event)
			return [x, y]
		}).flat() as unknown as number[]

		const newLine: PathLineData = {
			...this.data,
			points,
		}
		return newLine
	}
}
