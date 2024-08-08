import { ImageMark } from "..";
import { EventBindingThis } from "../event";


export class Plugin extends EventBindingThis {
	static pluginName: string;
	imageMark: ImageMark;
	constructor(imageMarkInstance: ImageMark) {
		super();
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.pluginName) {
			throw new Error(`${constructor.name} must have a static property 'pluginName'`);
		}
		this.imageMark = imageMarkInstance;
	}

	beforePluginRemove() {

	}

	destroy() {
	}
}
