import { G, Image } from "@svgdotjs/svg.js";
import { getDefaultTransform, ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
import { ImageMark } from "..";
import { getBoundingBoxByTwoPoints } from "./Rect";


export interface ImageData extends ShapeData {
	x: number
	y: number
	width?: number
	height?: number
	src: string
	shapeName: 'image'
}

export class ImageMarkImage extends ImageMarkShape<ImageData> {
	static shapeName = 'image'
	constructor(data: ImageData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	protected loadUrl: string = ''

	draw(): G {
		const { src, x, y, width, height, transform = getDefaultTransform() } = this.data
		const image = this.getMainShape<Image>() || new Image()
		image.id(this.getMainId())


		image.opacity(0.8)
		image.attr({
			preserveAspectRatio: 'none'
		})


		if (this.loadUrl === src) {
			this.drawInfo()
		} else {
			image.load(src, () => {
				this.loadUrl = src
				this.drawInfo()
			})
		}

		this.shapeInstance.transform(transform.matrix)

		image.addTo(this.shapeInstance)

		this.drawFuncList.forEach(func => {
			func(this)
		})

		this.options.initDrawFunc?.(this)

		return this.shapeInstance
	}

	protected drawInfo() {
		const image = this.shapeInstance.findOne('image') as Image
		image.size(this.data.width, this.data.height)
		const width = image.width() as number
		const height = image.height() as number
		this.shapeInstance.move(this.data.x - width / 2, this.data.y - height / 2)
	}


	mouseEvent2Data(options: MouseEvent2DataOptions): ImageData | null {
		const { eventList = [] } = options
		if (eventList.length < 2) return null
		const startPoint = this.imageMark.image.point(eventList[0])
		const endPoint = this.imageMark.image.point(eventList[eventList.length - 1])
		const { x, y, width, height } = getBoundingBoxByTwoPoints(startPoint, endPoint)
		const newImageData: ImageData = {
			...this.data,
			x,
			y,
			width: width * 2,
			height: height * 2,
		}
		return newImageData
	}
}
