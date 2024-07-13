import { Text } from "@svgdotjs/svg.js";
import { ImageMark } from "../../../../package";
import { ShapePlugin } from "../../../../package/plugins/ShapePlugin";

export class TeamMarkPlugin extends ShapePlugin {
	static pluginName = "teamMark";
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		this.imageMark
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
			this.data.push({
				shapeName: 'teamMark',
				// @ts-ignore
				x: e.imageClientX,
				// @ts-ignore
				y: e.imageClientY,
				//TODO(width height caculate):
				width: 30 + box.width,
				height: 30,
				teamName: data
			})
			this.rerender()
		}
	}

	onDragOver(e: DragEvent) {
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = "copy";
		}
	}
}
