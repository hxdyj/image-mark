import { G, Image } from "@svgdotjs/svg.js";
import { ImageMarkShape, MouseEvent2DataOptions, ShapeData, ShapeOptions } from "./Shape";
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
	image: Image
	constructor(data: ImageData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		const group = new G()
		super(data, imageMarkInstance, options, group)
		this.image = new Image()
		group.add(this.image)
		this.draw()
	}

	protected loadUrl: string = ''

	draw(): G {
		this.image.opacity(0.8)
		this.image.attr({
			preserveAspectRatio: 'none'
		})



		if (this.loadUrl === this.data.src) {
			this.drawInfo()
		} else {
			this.image.load(this.data.src, () => {
				this.loadUrl = this.data.src
				this.drawInfo()
			})
		}

		return this.shapeInstance
	}

	protected drawInfo() {
		this.image.size(this.data.width, this.data.height)
		const width = this.image.width() as number
		const height = this.image.height() as number
		this.shapeInstance.move(this.data.x - width / 2, this.data.y - height / 2)
	}

	updateData(newData: ImageData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
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
