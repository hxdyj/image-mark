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


	//插件被移除之前触发
	beforePluginRemove() {

	}

	// ImageMark实例被销毁时触发
	destroy() {

	}
}
