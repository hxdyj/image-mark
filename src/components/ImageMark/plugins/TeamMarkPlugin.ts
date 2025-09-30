import { uid } from "uid";
import { ImageMark } from "#/index";
import { ShapePlugin } from "#/plugins/ShapePlugin";
import { TeamData, TeamShape } from "../shape/TeamShape";
import { Text, Box } from "@svgdotjs/svg.js";
import { EventBusEventName } from "#/event/const";


export declare namespace SchemaDTO {

	/**
	 * TreeNode
	 */
	export interface TreeNode {
		/**
		 * Child nodes
		 */
		children?: TreeNode[];
		/**
		 * Name
		 */
		name: string;
		/**
		 * Num
		 */
		num: number;
		/**
		 * Remark
		 */
		remark: string;
		/**
		 * Uuid
		 */
		uuid: string;
	}
}


export function getTextBox(content: string, fontSize = 18) {
	let text = new Text()
	text.font({ family: 'Arial', size: fontSize })
	text.text(content)
	return text.bbox()
}

export function createTeamData(options?: {
	teamName?: string,
	prefixName?: string,
	uuid?: string,
	x?: number,
	y?: number
}): TeamData {

	const { uuid = uid(9), teamName = '', x = 0, y = 0, prefixName = '' } = options || {}

	let height = 30
	let teamNameBox = getTextBox(teamName)
	let width = teamNameBox.width
	let prefixNameBox: Box | undefined = undefined
	if (prefixName) {
		height = 60
		prefixNameBox = getTextBox(prefixName, 16)
		width = Math.max(width, prefixNameBox.width)
	}

	let teamData: TeamData = {
		shapeName: "teamMark",
		prefixName,
		uuid,
		teamName,
		x,
		y,
		width: 30 + width,
		height: height,
		prefixNameBox,
		teamNameBox
	}
	return teamData
}


export function createTeamDataByTreeNode(node: SchemaDTO.TreeNode): TeamData {
	let prefixName = Reflect.get(node, '_prefixName')
	return createTeamData({
		teamName: node?.name || '',
		uuid: node.uuid,
		prefixName
	})
}

export class TeamMarkPlugin extends ShapePlugin<TeamData> {
	static pluginName = "shape";
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		this.bindEventThis([
			"onDrop",
			"onDragOver",
			"onScale",
		]);
		this.bindTeamMarkEvent()
	}

	bindTeamMarkEvent() {
		this.imageMark.on(EventBusEventName.container_drop, this.onDrop)
		this.imageMark.on(EventBusEventName.container_drag_over, this.onDragOver)
		this.imageMark.on(EventBusEventName.scale, this.onScale)
	}

	unbindTeamMarkEvent() {
		this.imageMark.off(EventBusEventName.container_drop, this.onDrop)
		this.imageMark.off(EventBusEventName.container_drag_over, this.onDragOver)
		this.imageMark.off(EventBusEventName.scale, this.onScale)
	}

	rerender() {
		this.onRerender()
	}

	onDrop(e: DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = "copy";
		}
		const dataTransfer = e.dataTransfer?.getData('text/plain')
		if (!dataTransfer) return
		let node = JSON.parse(dataTransfer) as SchemaDTO.TreeNode
		if (this.data.find(item => item.uuid === node.uuid)) return
		let shapeData = createTeamDataByTreeNode(node)

		const { x, y } = this.imageMark.image.point(e)
		shapeData.x = x
		shapeData.y = y

		this.addNode(shapeData)
	}

	onDragOver(e: DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "copy";
		}
	}

	onScale() {
		Promise.resolve().then(() => {
			this.data.forEach(item => {
				let instance = this.getInstanceByData(item) as TeamShape | null
				instance?.onScaleUpdate()
			})
		})
	}
}
