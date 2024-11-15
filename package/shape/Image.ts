import { G, Image, Rect } from "@svgdotjs/svg.js";
import { ImageMarkShape, ShapeData, ShapeOptions } from "./Shape";
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
		const group = new G()
		const image = new Image()
		group.add(image)
		super(data, imageMarkInstance, options, group)
		this.draw()
	}

	draw(): G {
		const image = this.shapeInstance.findOne('image') as Image
		image.opacity(0.8)
		image.attr({
			preserveAspectRatio: 'none'
		})
		this.shapeInstance.move(this.data.x, this.data.y)

		image.load(this.data.src, () => {
			image.size(this.data.width, this.data.height)
			const width = image.width()
			const height = image.height()
			const { translateX = 0, translateY = 0 } = this.shapeInstance.transform()

			this.shapeInstance.transform({
				translate: [- translateX, - translateY]
			})

			this.shapeInstance.transform({
				translate: [-width / 2, -height / 2]
			})
		})
		return this.shapeInstance
	}

	updateData(newData: ImageData): G {
		this.data = newData
		this.draw()
		return this.shapeInstance
	}


	mouseEvent2Data(eventList: MouseEvent[]): ImageData | null {
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
