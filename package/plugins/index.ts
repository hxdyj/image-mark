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
		this.bindEventThis(['onInit'])
	}

	bindEvent() {
		this.imageMark.on('init', this.onInit)
	}

	unbindEvent() {
		this.imageMark.off('init', this.onInit)
	}

	//当ImageMark init之后触发
	onInit() {

	}

	//插件被移除之前触发
	beforePluginRemove() {

	}

	// ImageMark实例被销毁时触发
	destroy() {
		this.unbindEvent()
	}
}
