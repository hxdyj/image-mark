import { G, Line, Path, Polygon, Polyline } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeMouseDrawType, ShapeOptions } from "./Shape";
import ImageMark from "../index";

export interface PathLineData extends ShapeData {
	shapeName: "pathline",
	points: number[],
}

export class ImageMarkPathLine extends ImageMarkShape<PathLineData> {
	static shapeName = "pathline"

	constructor(data: PathLineData, imageMarkInstance: ImageMark, options?: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	draw(): G {
		const { points } = this.data
		const path = this.getMainShape<Path>() || new Path()
		path.id(this.getMainId())

		const d = points.reduce((pre, current, index) => {
			let append = ` ${current}`
			if (index % 2 === 0 && index !== 0) {
				append = ` L${append}`
			}
			return pre + append
		}, points?.length ? 'M' : '')
		path.plot(d).stroke(this.attr?.stroke || {}).fill(this.attr?.fill || 'none')
		path.addTo(this.shapeInstance)
		this.drawLabel()
		this.drawFuncList.forEach(func => {
			func(this)
		})

		return this.shapeInstance
	}

	translate(x: number, y: number): void {
		this.data.points = this.data.points.map((point, index) => {
			if (index % 2 === 0) {
				return point + x
			}
			return point + y
		})
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}

	fixData(data?: PathLineData | undefined): void {
		data = data || this.data
		const flagName = this.getPreStatusOperateActionName()
		if (flagName) {
			data.points = data.points.map((point, index) => {
				if (index % 2 === 0) {
					return this.imageMark.options.action?.[flagName] ? point : this.clampX(point)
				}
				return this.imageMark.options.action?.[flagName] ? point : this.clampY(point)
			})
		}
	}

	mouseEvent2Data(options: MouseEvent2DataOptions): PathLineData | null {
		const { pointList = [] } = options
		if (!pointList.length) return null
		const points = pointList.map(point => {
			return [point.x, point.y]
		}).flat() as unknown as number[]

		const newLine: PathLineData = {
			...this.data,
			points,
		}
		return newLine
	}

	drawEdit() {
	}
}
