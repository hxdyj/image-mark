import { Box, Circle, G, Line, MatrixExtract, Rect, Svg, Text } from "@svgdotjs/svg.js";
import { BoundingBox, ImageMark } from "../../../../package";
import { ShapeData, ImageMarkShape, ShapeOptions } from "#/shape/Shape";
import { EventBusEventName } from "#/event/const";
import { curryRight } from "lodash-es";

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
	constructor(data: TeamData, imageMarkInstance: ImageMark, options: ShapeOptions) {
		super(data, imageMarkInstance, options)
	}

	onScaleUpdate() {
		this.draw()
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


	afterRender(): void {
		super.afterRender()
		const { _width, _height } = this.getStageGroupScaleInfo()
		const innerGroup = this.shapeInstance.findOne('.team-shape-inner-group') as G
		innerGroup.transform({
			translate: [-_width / 2, -_height]
		}, false)
	}

	draw(): G {
		const { prefixName, x, y } = this.data
		const { _width, _height, width, height, getNum } = this.getStageGroupScaleInfo()


		const innerGroup = this.shapeInstance.findOne('.team-shape-inner-group') as G || new G()
		innerGroup.addClass('team-shape-inner-group')
		const groupRect = this.shapeInstance.findOne('.team-shape-group-rect') as Rect || new Rect()
		if (!groupRect.hasClass('team-shape-group-rect')) {
			this.shapeInstance.on('mouseover', () => {
				document.body.style.cursor = 'pointer'
				groupRect.fill('rgba(22, 93, 255,1)')
			})

			this.shapeInstance.on('mouseout', () => {
				document.body.style.cursor = 'auto'
				groupRect.fill('rgba(22, 93, 255,0.7)')
			})
		}
		groupRect.size(_width, _height).fill('rgba(22, 93, 255,0.7)').radius(getNum(6)).addClass('team-shape-group-rect')
		groupRect.addTo(innerGroup)

		let centerLine = undefined
		let topText = undefined

		if (prefixName) {
			centerLine = this.shapeInstance.findOne('.team-shape-center-line') as Line || new Line()
			centerLine?.plot(0, getNum(30), getNum(width), getNum(30)).stroke({ color: 'white', width: getNum(1), opacity: 0.7 }).addClass('team-shape-center-line')
			centerLine.addTo(innerGroup)

			topText = this.shapeInstance.findOne('.team-shape-top-text') as Text || new Text()
			topText?.font({ family: 'Arial', size: getNum(16) }).text(prefixName).fill('white').center(_width / 2, getNum((height - (prefixName ? 30 : 0)) / 2)).attr({
				style: 'user-select:none'
			}).addClass('team-shape-top-text')
			topText.addTo(innerGroup)
		}


		let bottomText = this.shapeInstance.findOne('.team-shape-bottom-text') as Text || new Text()
		bottomText.font({ family: 'Arial', size: getNum(18) }).text(this.data.teamName).fill('white').center(_width / 2, getNum((height - (prefixName ? 30 : 0)) / 2 + (prefixName ? 30 : 0))).attr({
			style: 'user-select:none'
		}).addClass('team-shape-bottom-text')
		bottomText.addTo(innerGroup)

		let anchorCircle = this.shapeInstance.findOne('.team-shape-anchor-circle') as Circle || new Circle()
		anchorCircle.size(getNum(10)).fill('rgba(0,0,0,1)').center(_width / 2, _height).addClass('team-shape-anchor-circle')
		anchorCircle.addTo(innerGroup)


		const closeSize = getNum(20)
		const closePad = getNum(8)
		let closeIcon = this.shapeInstance.findOne('.team-shape-close-icon') as Svg || new Svg()
		closeIcon.svg(`<svg t="1730359194486" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11380" width="100%" height="100%">
			<rect width="70%" height="70%" x="15%" y="15%"  fill="#fff"></rect>
			<path d="M810.666667 128H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333V810.666667a85.333333 85.333333 0 0 0 85.333333 85.333333H810.666667a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333m-145.066667 597.333333L512 571.733333 358.4 725.333333 298.666667 665.6l153.6-153.6L298.666667 358.4 358.4 298.666667l153.6 153.6L665.6 298.666667 725.333333 358.4 571.733333 512l153.6 153.6-59.733333 59.733333z" fill="" p-id="11381"></path>
			</svg>`)

		if (!closeIcon.hasClass('.team-shape-close-icon')) {
			closeIcon.on('click', (e) => {
				this.shapeInstance.remove()
				this.imageMark.eventBus.emit(EventBusEventName.shape_delete, this.data, this, this.imageMark)
			})
			closeIcon.on('mousedown', (e) => {
				e.stopPropagation()
			})
		}
		closeIcon.size(closeSize, closeSize).center(_width - closePad, closePad).addClass('team-shape-close-icon')
		closeIcon.addTo(innerGroup)

		this.shapeInstance.transform({
			translate: [x, y]
		}, false)

		innerGroup.addTo(this.shapeInstance)

		if (this.isRendered) {
			innerGroup.transform({
				translate: [-_width / 2, -_height]
			}, false)
		}

		return this.shapeInstance
	}
}
