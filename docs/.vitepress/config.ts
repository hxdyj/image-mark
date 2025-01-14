import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "ImageMark",
	description: "A mark tools for image.",
	locales: {
		root: {
			label: '中文',
			lang: 'zh',
		},
		en: {
			label: 'English',
			lang: 'en',
			link: '/en/index'
		}
	},
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		i18nRouting: true,
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Examples', link: '/markdown-examples' }
		],
		sidebar: [
			{
				text: 'Examples',
				items: [
					{ text: 'Markdown Examples', link: '/markdown-examples' },
					{ text: 'Runtime API Examples', link: '/api-examples' }
				]
			}
		],
	}
})
