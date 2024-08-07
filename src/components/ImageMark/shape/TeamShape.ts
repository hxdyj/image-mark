import { Circle, G, MatrixExtract, Rect, Text } from "@svgdotjs/svg.js";
import { BoundingBox, ImageMark } from "../../../../package";
import { ImageMarkShape, ShapeData } from "../../../../package/shape/Shape";
import { EventBusEventName } from "../../../../package/event/const";
import { LmbMoveAction } from "../../../../package/action/LmbMoveAction";


export interface TeamData extends BoundingBox, ShapeData {
	shapeName: "teamMark"
	teamName: string
}
export class TeamShape extends ImageMarkShape<TeamData> {
	static shapeName = "teamMark"
	shapeInstance: G
	constructor(data: TeamData, imageMarkInstance: ImageMark) {
		super(data, imageMarkInstance)
		this.shapeInstance = new G()
		this.draw()
	}
	draw(): G {
		this.shapeInstance.translate(this.data.x - this.data.width / 2, this.data.y - this.data.height)
		let rect = new Rect()
		rect.size(this.data.width, this.data.height).fill('rgba(239,114,0,0.7)').radius(6)
		this.shapeInstance.on('mouseover', () => {
			document.body.style.cursor = 'pointer'
			rect.fill('rgba(239,114,0,1)')
		})

		this.shapeInstance.on('mouseout', () => {
			document.body.style.cursor = 'auto'
			rect.fill('rgba(239,114,0,0.7)')
		})
		this.shapeInstance.add(rect)

		let text = new Text()
		text.font({ family: 'Arial', size: 18 })
		text.text(this.data.teamName).fill('white').center(this.data.width / 2, this.data.height / 2).attr({
			style: 'user-select:none'
		})
		this.shapeInstance.add(text)

		let circle = new Circle()
		circle.size(10).fill('rgba(239,114,0,1)')
		circle.center(this.data.width / 2, this.data.height)
		this.shapeInstance.add(circle)

		this.shapeInstance.on('dblclick', () => {
			this.shapeInstance.remove()
			this.imageMark.eventBus.emit(EventBusEventName.shape_delete, this.data, this.shapeInstance, this.imageMark)
		})

		return this.shapeInstance
	}
}

TeamShape.useAction(LmbMoveAction, {
	limit(imageMark: ImageMark, shape: TeamShape, nextTransform: MatrixExtract) {
		let circle = shape.shapeInstance.findOne('circle') as Circle
		let circleBox = circle.bbox()
		console.log(`${new Date().getTime()} nextTransform`, nextTransform);
		let { translateX = 0, translateY = 0 } = nextTransform
		let points = [[circleBox.x + translateX, circleBox.y + translateY], [circleBox.x + circleBox.width + translateX, circleBox.y + circleBox.height + translateY]]
		// const {scaleX=1} = imageMark.stageGroup.transform()
		let { naturalHeight, naturalWidth } = imageMark.imageDom
		let isOutOfBounds = points.some(point => {
			return !(point[0] >= 0 && point[0] <= naturalWidth && point[1] >= 0 && point[1] <= naturalHeight)
		});

		console.log(new Date().getTime(), points, isOutOfBounds);
		return isOutOfBounds
	}
})
