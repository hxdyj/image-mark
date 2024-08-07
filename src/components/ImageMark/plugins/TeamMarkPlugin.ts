import { Text } from "@svgdotjs/svg.js";
import { ImageMark } from "../../../../package";
import { ShapePlugin } from "../../../../package/plugins/ShapePlugin";
import { TeamData } from "../shape/TeamShape";

export class TeamMarkPlugin extends ShapePlugin<TeamData> {
	static pluginName = "teamMark";
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		this.bindEventThis(["onDrop", "onDragOver"]);
		this.bindTeamMarkEvent()
	}

	bindTeamMarkEvent() {
		this.imageMark.on('container_drop', this.onDrop)
		this.imageMark.on('container_drag_over', this.onDragOver)
	}

	unbindTeamMarkEvent() {
		this.imageMark.off('container_drop', this.onDrop)
		this.imageMark.off('container_drag_over', this.onDragOver)

	}

	onDrop(e: DragEvent) {
		if (e.dataTransfer)
			e.dataTransfer.dropEffect = "copy";
		let data = e.dataTransfer?.getData('text/plain') || 'No Title'

		let text = new Text()
		text.font({ family: 'Arial', size: 18 })
		text.text(data)
		let box = text.bbox()
		if (data) {
			this.onAdd({
				shapeName: 'teamMark',
				// @ts-ignore
				x: e.imageClientX,
				// @ts-ignore
				y: e.imageClientY,
				width: 30 + box.width,
				height: 30,
				teamName: data
			})

		}
	}

	onDragOver(e: DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "copy";
		}
	}
}
