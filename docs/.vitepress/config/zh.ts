import { DefaultTheme, defineConfig } from 'vitepress'
import pkg from '../../../package.json'

// https://vitepress.dev/reference/site-config
export const zh = defineConfig({
	lang: 'zh-Hans',
	description: '一个框架无关的JS图片标注库，支持多种标注方式，包括矩形、圆、多边形、直线、图片、Path等',
	themeConfig: {
		nav: nav(),
		sidebar: {
			'/start/': {
				base: '/start',
				items: [
					{ text: '简介', link: '/introduction' },
					{ text: '开始', link: '/start' },
				]
			},
			'/guide/': {
				base: '/guide',
				items: [
					{ text: '基本使用', link: '/base' },
					{ text: '多实例', link: '/multiple-instance' },
				]
			},
			'/api/': {
				base: '/api',
				items: [
					{
						text: 'ImageMark类', items: [
							{ text: '构造函数', link: '/constructor-options' },
							{ text: '属性', link: '/constructor-props' },
							{ text: '方法', link: '/constructor-methods' },
							{ text: '事件', link: '/constructor-on' },
						]
					},
					{
						text: 'Plugin类', link: '/plugin-class', items:
							[
								{ text: 'Shape', link: '/plugin/shape' },
								{ text: 'Selection', link: '/plugin/selection' },
							]
					},
					{
						text: 'Shape类', link: '/shape-class', items: [
							{ text: 'Line', link: '/shape/line' },
							{ text: 'Rect', link: '/shape/rect' },
							{ text: 'Image', link: '/shape/image' },
							{ text: 'Circle', link: '/shape/circle' },
							{ text: 'Polygon', link: '/shape/polygon' },
							{ text: 'PolyLine', link: '/shape/poly-line' },
							{ text: 'PathLine', link: '/shape/path-line' },
						]
					},
					{
						text: 'Action类', link: '/action-class', items: [
							{ text: 'LmbMove', link: '/action/lmb-move' },
							{ text: 'Selection', link: '/action/selection' },
						]
					},
				]
			},
		},

		// editLink: {
		// 	pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
		// 	text: '在 GitHub 上编辑此页面'
		// },

		footer: {
			message: '基于<a href="https://github.com/hxdyj/image-mark-demo/blob/main/LICENSE">MIT 许可</a>',
			copyright: `Copyright © 2025-present <a href="https://github.com/hxdyj">hxdyj</a>`
		},

		docFooter: {
			prev: '上一页',
			next: '下一页'
		},

		outline: {
			label: '大纲',
			level: 'deep'
		},

		lastUpdated: {
			text: '最后更新于',
			formatOptions: {
				dateStyle: 'short',
				timeStyle: 'medium'
			}
		},

		langMenuLabel: '多语言',
		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
		darkModeSwitchLabel: '主题',
		lightModeSwitchTitle: '切换到浅色模式',
		darkModeSwitchTitle: '切换到深色模式',
	}
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: 'Demo',
			link: 'http://localhost:5173/',
		},
		{
			text: '开始',
			link: '/zh/start/start',
			activeMatch: '/start'
		},
		{
			text: 'API',
			link: '/zh/api/constructor-options',
			activeMatch: '/api'
		},
		{
			text: '赞助',
			link: '/zh/guide/what-is-vitepress',
			activeMatch: '/zh/guide/'
		},
		{
			text: pkg.version,
			items: [
				{
					text: '更新日志',
					link: 'https://github.com/hxdyj/image-mark-demo/blob/main/CHANGELOG.md'
				}
			]
		}
	]
}


export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
	zh: {
		placeholder: '搜索文档',
		translations: {
			button: {
				buttonText: '搜索文档',
				buttonAriaLabel: '搜索文档'
			},
			modal: {
				searchBox: {
					resetButtonTitle: '清除查询条件',
					resetButtonAriaLabel: '清除查询条件',
					cancelButtonText: '取消',
					cancelButtonAriaLabel: '取消'
				},
				startScreen: {
					recentSearchesTitle: '搜索历史',
					noRecentSearchesText: '没有搜索历史',
					saveRecentSearchButtonTitle: '保存至搜索历史',
					removeRecentSearchButtonTitle: '从搜索历史中移除',
					favoriteSearchesTitle: '收藏',
					removeFavoriteSearchButtonTitle: '从收藏中移除'
				},
				errorScreen: {
					titleText: '无法获取结果',
					helpText: '你可能需要检查你的网络连接'
				},
				footer: {
					selectText: '选择',
					navigateText: '切换',
					closeText: '关闭',
					searchByText: '搜索提供者'
				},
				noResultsScreen: {
					noResultsText: '无法找到相关结果',
					suggestedQueryText: '你可以尝试查询',
					reportMissingResultsText: '你认为该查询应该有结果？',
					reportMissingResultsLinkText: '点击反馈'
				}
			}
		}
	}
}
