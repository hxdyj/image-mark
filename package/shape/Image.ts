import { G, Image } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeDrawType, ShapeOptions } from "./Shape";
import { ImageMark } from "..";
import { getBoundingBoxByTwoPoints } from "./Rect";


export interface ImageData extends ShapeData {
	x: number
	y: number
	width: number
	height: number
	src: string
	shapeName: 'image'
	//todo 保持比例
}

export class ImageMarkImage extends ImageMarkShape<ImageData> {
	static shapeName = 'image'
	constructor(data: ImageData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	sourceWH: {
		width: number,
		height: number
	} | null = null

	protected loadUrl: string = ''
	readonly drawType: ShapeDrawType = 'centerRxy'

	draw(): G {
		const { src } = this.data
		const image = this.getMainShape<Image>() || new Image()
		image.id(this.getMainId())
		image.opacity(this.attr?.image?.opacity ?? 0.8)
		image.attr({
			preserveAspectRatio: this.attr?.image?.preserveAspectRatio
		})


		if (this.loadUrl === src) {
			this.drawInfo()
		} else {
			image.load(src, (evt) => {
				this.sourceWH = {
					//@ts-ignore
					width: evt.target?.naturalWidth || 0,
					//@ts-ignore
					height: evt.target?.naturalHeight || 0
				}
				this.loadUrl = src
				this.drawInfo()
			})
		}

		image.addTo(this.shapeInstance)
		this.drawLabel()

		this.drawFuncList.forEach(func => {
			func(this)
		})
		return this.shapeInstance
	}

	protected drawInfo() {
		const image = this.shapeInstance.findOne('image') as Image
		image.size(this.data.width, this.data.height)
		this.shapeInstance.move(this.data.x, this.data.y)
	}

	onEndDrawing() {
		const img = this.getMainShape()
		const preserveAspectRatio = img.attr('preserveAspectRatio')
		if (this.sourceWH && (preserveAspectRatio === 'xMidYMid' || !preserveAspectRatio)) {
			const { x, y, width, height } = this.data
			let boxFitScale = this.sourceWH.width / this.sourceWH.height > width / height ? this.sourceWH.width / width : this.sourceWH.height / height  // 长边尽量展示出来
			const scaleWH = {
				width: this.sourceWH.width / boxFitScale,
				height: this.sourceWH.height / boxFitScale,
			}
			this.data.width = scaleWH.width
			this.data.height = scaleWH.height
			this.data.x = x + Math.abs(scaleWH.width - width) / 2
			this.data.y = y + Math.abs(scaleWH.height - height) / 2
		}
	}

	translate(x: number, y: number): void {
		this.data.x += x
		this.data.y += y
		this.shapeInstance.transform({
			translate: [0, 0]
		}, false)
	}


	mouseEvent2Data(options: MouseEvent2DataOptions): ImageData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const halfWidth = Math.abs(endPoint.x - startPoint.x)
		const halfHeight = Math.abs(endPoint.y - startPoint.y)
		const newImageData: ImageData = {
			...this.data,
			x: startPoint.x - halfWidth,
			y: startPoint.y - halfHeight,
			width: halfWidth * 2,
			height: halfHeight * 2,
		}
		return newImageData
	}
}
