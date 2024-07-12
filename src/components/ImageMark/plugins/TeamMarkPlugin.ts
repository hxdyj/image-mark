import { ImageMark } from "../../../../package";
import { ShapePlugin } from "../../../../package/plugins/ShapePlugin";

export class TeamMarkPlugin extends ShapePlugin {
	static pluginName = "teamMark";
	constructor(imageMarkInstance: ImageMark) {
		super(imageMarkInstance);
		this.imageMark
		this.bindEventThis(["onDrop", "onDragOver"]);
	}

	bindTeamMarkEvent() {
		this.imageMark.on('drop', this.onDrop)
	}

	unbindTeamMarkEvent() {
		this.imageMark.off('drop', this.onDrop)
	}

	onDrop(e: DragEvent) {
		debugger
	}

	// onDragOver(e: DragEvent) {

	// }
}
