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
		let data = e.dataTransfer?.getData('text/plain') || 'hahah'
		if (data) {
			this.data.push({
				shapeName: 'teamMark',
				// @ts-ignore
				x: e.imageClientX,
				// @ts-ignore
				y: e.imageClientY,
				width: 100,
				height: 40,
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
