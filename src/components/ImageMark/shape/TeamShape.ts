import { Box, Circle, G, Line, MatrixExtract, Rect, Svg, Text } from "@svgdotjs/svg.js";
import { BoundingBox, ImageMark } from "../../../../package";
import { ShapeData, ImageMarkShape } from "#/shape/Shape";
import { LmbMoveAction } from "#/action/LmbMoveAction";
import { EventBusEventName } from "#/event/const";
import { curryRight } from "lodash";

export class ImageMarkEventKey {
	static TEAM_SHAPE_LMB_MOVE_END = "team_shape_lmb_move_end";
}

export interface TeamData extends BoundingBox, ShapeData {
	shapeName: "teamMark"
	teamName: string
	prefixName: string
	uuid: string
	teamNameBox?: Box
	prefixNameBox?: Box
}

const getScaleNumber = curryRight((num: number, scale: number) => {
	return num / scale
})

export class TeamShape extends ImageMarkShape<TeamData> {
	static shapeName = "teamMark"
	shapeInstance: G
	constructor(data: TeamData, imageMarkInstance: ImageMark) {
		super(data, imageMarkInstance)
		this.shapeInstance = new G()
		this.draw()
	}

	update() {
		this.drawElements({
			groupRect: this.shapeInstance.findOne('.team-shape-group-rect') as Rect,
			centerLine: this.shapeInstance.findOne('.team-shape-center-line') as Line,
			topText: this.shapeInstance.findOne('.team-shape-top-text') as Text,
			bottomText: this.shapeInstance.findOne('.team-shape-bottom-text') as Text,
			anchorCircle: this.shapeInstance.findOne('.team-shape-anchor-circle') as Circle,
			closeIcon: this.shapeInstance.findOne('.team-shape-close-icon') as Svg,
			innerGroup: this.shapeInstance.findOne('.team-shape-inner-group') as G,
		})
	}


	getStageGroupScaleInfo() {
		const { scaleX = 1 } = this.imageMark.stageGroup.transform()
		const getNum = getScaleNumber(scaleX)
		let { prefixName = '', width, height, x, y } = this.data
		const _width = getNum(width)
		const _height = getNum(height)
		return {
			_width,
			_height,
			width,
			height,
			x, y, prefixName,
			getNum,
		}
	}

	drawElements(options: {
		groupRect: Rect,
		centerLine?: Line,
		topText?: Text,
		bottomText: Text,
		anchorCircle: Circle,
		closeIcon: Svg,
		innerGroup: G
	}) {
		let { groupRect, centerLine, topText, bottomText, anchorCircle, closeIcon, innerGroup } = options
		const { _width, _height, width, height, prefixName, getNum } = this.getStageGroupScaleInfo()
		innerGroup.addClass('team-shape-inner-group')

		groupRect.size(_width, _height).fill('rgba(239,114,0,0.7)').radius(getNum(6)).addClass('team-shape-group-rect')
		if (prefixName) {
			centerLine?.plot(0, getNum(30), getNum(width), getNum(30)).stroke({ color: 'white', width: getNum(1), opacity: 0.7 }).addClass('team-shape-center-line')
			topText?.font({ family: 'Arial', size: getNum(16) }).text(prefixName).fill('white').center(_width / 2, getNum((height - (prefixName ? 30 : 0)) / 2)).attr({
				style: 'user-select:none'
			}).addClass('team-shape-top-text')
		}

		bottomText.font({ family: 'Arial', size: getNum(18) }).text(this.data.teamName).fill('white').center(_width / 2, getNum((height - (prefixName ? 30 : 0)) / 2 + (prefixName ? 30 : 0))).attr({
			style: 'user-select:none'
		}).addClass('team-shape-bottom-text')

		// anchorCircle.size(getNum(10)).fill('rgba(239,114,0,1)').center(_width / 2, _height).addClass('team-shape-anchor-circle')
		anchorCircle.size(getNum(10)).fill('rgba(0,0,0,1)').center(_width / 2, _height).addClass('team-shape-anchor-circle')

		const closeSize = getNum(20)
		const closePad = getNum(8)
		closeIcon.size(closeSize, closeSize).center(_width - closePad, closePad).addClass('team-shape-close-icon')
		if (this.isRendered) {
			innerGroup.transform({
				translate: [-_width / 2, -_height]
			}, false)
		}
		return this.shapeInstance
	}

	afterRender(): void {
		const { _width, _height } = this.getStageGroupScaleInfo()
		const innerGroup = this.shapeInstance.findOne('.team-shape-inner-group') as G
		innerGroup.transform({
			translate: [-_width / 2, -_height]
		}, false)
	}

	draw(): G {
		const { prefixName, x, y } = this.data

		this.shapeInstance.translate(x, y)
		let debugRect = new Rect()
		this.shapeInstance.add(debugRect)

		let innerGroup = new G()

		let groupRect = new Rect()
		this.shapeInstance.on('mouseover', () => {
			document.body.style.cursor = 'pointer'
			groupRect.fill('rgba(239,114,0,1)')
		})

		this.shapeInstance.on('mouseout', () => {
			document.body.style.cursor = 'auto'
			groupRect.fill('rgba(239,114,0,0.7)')
		})

		innerGroup.add(groupRect)

		let centerLine = undefined
		let topText = undefined

		if (prefixName) {
			centerLine = new Line()
			innerGroup.add(centerLine)
			topText = new Text()

			innerGroup.add(topText)
		}


		let bottomText = new Text()

		innerGroup.add(bottomText)

		let anchorCircle = new Circle()

		innerGroup.add(anchorCircle)

		let closeIcon = new Svg()
		closeIcon.svg(`<svg t="1730359194486" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11380" width="100%" height="100%">
			<rect width="70%" height="70%" x="15%" y="15%"  fill="#fff"></rect>
			<path d="M810.666667 128H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333V810.666667a85.333333 85.333333 0 0 0 85.333333 85.333333H810.666667a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333m-145.066667 597.333333L512 571.733333 358.4 725.333333 298.666667 665.6l153.6-153.6L298.666667 358.4 358.4 298.666667l153.6 153.6L665.6 298.666667 725.333333 358.4 571.733333 512l153.6 153.6-59.733333 59.733333z" fill="" p-id="11381"></path>
			</svg>`)

		innerGroup.add(closeIcon)

		closeIcon.on('click', (e) => {
			this.shapeInstance.remove()
			this.imageMark.eventBus.emit(EventBusEventName.shape_delete, this.data, this, this.imageMark)
		})
		closeIcon.on('mousedown', (e) => {
			e.stopPropagation()
		})

		this.shapeInstance.on('dblclick', () => {
			// this.shapeInstance.remove()
			// this.imageMark.eventBus.emit(EventBusEventName.shape_delete, this.data, this, this.imageMark)
		})

		this.shapeInstance.add(innerGroup)

		this.drawElements({
			groupRect,
			centerLine,
			topText,
			bottomText,
			anchorCircle,
			closeIcon,
			innerGroup
		})

		return this.shapeInstance
	}
}


TeamShape.useAction(LmbMoveAction, {
	limit(imageMark: ImageMark, shape: TeamShape, nextTransform: MatrixExtract) {
		let circle = shape.shapeInstance.findOne('circle') as Circle
		let circleBox = circle.bbox()
		let { translateX = 0, translateY = 0 } = nextTransform
		let points = [[circleBox.x + translateX, circleBox.y + translateY], [circleBox.x + circleBox.width + translateX, circleBox.y + circleBox.height + translateY]]
		let { naturalHeight, naturalWidth } = imageMark.imageDom
		let isOutOfBounds = points.some(point => {
			return !(point[0] >= 0 && point[0] <= naturalWidth && point[1] >= 0 && point[1] <= naturalHeight)
		});

		return isOutOfBounds
	},
	onEnd(imageMark: ImageMark, shape: ImageMarkShape) {
		const teamData = shape.data as TeamData
		const { translateX = teamData.x, translateY = teamData.y } = shape.shapeInstance.transform()
		const anchorCircle = shape.shapeInstance.findOne('.team-shape-anchor-circle') as Circle
		const box = anchorCircle.bbox()
		const coordinate = [translateX + box.x + box.width / 2, translateY + box.y + box.height / 2]
		imageMark.eventBus.emit(ImageMarkEventKey.TEAM_SHAPE_LMB_MOVE_END, imageMark, shape, coordinate)
	}
})
