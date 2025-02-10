import { zh } from './zh'
import { en } from './en'
export const locales = {
	en: {
		langPath: 'en',
		label: 'English',
		...en
	},
	root: {
		langPath: 'zh',
		label: '中文',
		...zh
	}
}


export const langPathList = Object.values(locales).map(item => item.langPath)
