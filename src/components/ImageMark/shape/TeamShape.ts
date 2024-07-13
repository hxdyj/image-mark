import { Circle, G, Rect, Text } from "@svgdotjs/svg.js";
import { BoundingBox } from "../../../../package";
import { ImageMarkShape, ShapeData } from "../../../../package/shape/Shape";


export interface TeamData extends BoundingBox, ShapeData {
	shapeName: "teamMark"
	teamName: string
}

export class TeamShape extends ImageMarkShape {
	static shapeName = "teamMark"
	shapeInstance: G
	constructor(data: TeamData) {
		super(data)
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

		return this.shapeInstance
	}
}
