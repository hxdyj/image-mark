import { ImageMark } from "..";
import { EventBindingThis } from "../event/event";
import { defaultsDeep } from 'lodash-es';

export type PluginOptions = {
	[key: string]: any
}

export class Plugin extends EventBindingThis {
	static pluginName: string;
	static pluginOptions: PluginOptions = {}
	imageMark: ImageMark;
	constructor(imageMarkInstance: ImageMark, public pluginOptions?: PluginOptions) {
		super();
		const constructor = this.constructor
		// @ts-ignore
		if (!constructor.pluginName) {
			throw new Error(`${constructor.name} must have a static property 'pluginName'`);
		}
		this.imageMark = imageMarkInstance;
		this.bindEventThis(['onInit'])
	}

	getOptions<T extends PluginOptions = PluginOptions>(options?: T): T {
		const thisPlugin = Object.getPrototypeOf(this).constructor
		const thisPluginName = thisPlugin.pluginName
		return defaultsDeep(options, this.pluginOptions, this.imageMark.options.pluginOptions?.[thisPluginName], thisPlugin.pluginOptions)
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

	onReadonlyChange(readonly: boolean) {

	}

	// getThisPluginOptions<T>() {
	// 	// @ts-ignore
	// 	let pluginName = this.constructor['pluginName']
	// 	return this.imageMark.options.pluginOptions?.[pluginName] as T
	// }

	// ImageMark实例被销毁时触发
	destroy() {
		this.unbindEvent()
		//@ts-ignore
		const pluginName = this.constructor.pluginName
		delete this.imageMark.plugin[pluginName]
	}
}
