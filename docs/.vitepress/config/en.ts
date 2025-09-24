import { DefaultTheme, defineConfig } from 'vitepress'
import pkg from '../../../package.json'
export const en = defineConfig({
	lang: 'en-US',
	description: 'Vite & Vue powered static site generator.',

	themeConfig: {
		outline: {
			label: 'Outline',
			level: 'deep'
		},
		nav: nav(),
		sidebar: {
			'/en/start/': {
				base: '/en/start',
				items: [
					{ text: 'Introduction', link: '/introduction' },
					{ text: 'Getting Started', link: '/start' },
					{ text: 'How to Use the Plugin', link: '/use-plugin' },
					{ text: 'How to Use Action', link: '/use-action' },
					{ text: 'How to Draw Shapes with the Mouse', link: '/draw-shape' },
					{ text: 'How to Listen Events', link: '/event-listener' },
					{ text: 'Customize Selection Plugin Color on Selection', link: '/custom-selection-action' },
					// { text: 'Write Your Own Plugin', link: '/extend-plugin' },
					// { text: 'Write Your Own Action', link: '/extend-action' },
				]
			},
			'/en/api/': {
				base: '/en/api',
				items: [
					{
						text: 'ImageMark Class', items: [
							{ text: 'Constructor', link: '/constructor-options' },
							{ text: 'Properties', link: '/constructor-props' },
							{ text: 'Methods', link: '/constructor-methods' },
							{ text: 'Events', link: '/constructor-on' },
						]
					},
					{
						text: 'Plugin Class', link: '/plugin-class', items: [
							{ text: 'Shape', link: '/plugin/shape' },
							{ text: 'Selection', link: '/plugin/selection' },
							{ text: 'History', link: '/plugin/history' },
						]
					},
					{
						text: 'Shape Class', link: '/shape-class', items: [
							{ text: 'Line', link: '/shape/line' },
							{ text: 'Rect', link: '/shape/rect' },
							{ text: 'Image', link: '/shape/image' },
							{ text: 'Dot', link: '/shape/dot' },
							{ text: 'Circle', link: '/shape/circle' },
							{ text: 'Polygon', link: '/shape/polygon' },
							{ text: 'PolyLine', link: '/shape/poly-line' },
							{ text: 'PathLine', link: '/shape/path-line' },
						]
					},
					{
						text: 'Action Class', link: '/action-class', items: [
							{ text: 'LmbMove', link: '/action/lmb-move' },
							{ text: 'Selection', link: '/action/selection' },
						]
					},
				]
			},
		},

		// editLink: {
		// 	pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
		// 	text: 'Edit this page on GitHub'
		// },
		footer: {
			message: 'Released under the <a href="https://github.com/hxdyj/image-mark/blob/main/LICENSE">MIT License</a>.',
			copyright: `Copyright © 2025-present <a href="https://github.com/hxdyj">hxdyj</a>`
		}
	}
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: 'Demo',
			link: 'https://image-mark.demo.wingblog.top',
		},
		{
			text: 'Start',
			link: '/en/start/start',
			activeMatch: '/en/start'
		},
		{
			text: 'API',
			link: '/en/api/constructor-options',
			activeMatch: '/en/api'
		},
		{
			text: 'Sponsor',
			link: '/en/sponsor',
			activeMatch: '/en/sponsor'
		},
		{
			text: pkg.version,
			items: [
				{
					text: 'Changelog',
					link: 'https://github.com/hxdyj/image-mark/releases'
				}
			]
		}
	]
}


export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
	en: {
		placeholder: 'Search Documentation',
		translations: {
			button: {
				buttonText: 'Search Documentation',
				buttonAriaLabel: 'Search Documentation'
			},
			modal: {
				searchBox: {
					resetButtonTitle: 'Clear Query',
					resetButtonAriaLabel: 'Clear Query',
					cancelButtonText: 'Cancel',
					cancelButtonAriaLabel: 'Cancel'
				},
				startScreen: {
					recentSearchesTitle: 'Recent Searches',
					noRecentSearchesText: 'No recent searches',
					saveRecentSearchButtonTitle: 'Save to Recent Searches',
					removeRecentSearchButtonTitle: 'Remove from Recent Searches',
					favoriteSearchesTitle: 'Favorites',
					removeFavoriteSearchButtonTitle: 'Remove from Favorites'
				},
				errorScreen: {
					titleText: 'Unable to Fetch Results',
					helpText: 'You may need to check your network connection'
				},
				footer: {
					selectText: 'Select',
					navigateText: 'Navigate',
					closeText: 'Close',
					searchByText: 'Search by provider'
				},
				noResultsScreen: {
					noResultsText: 'No results found',
					suggestedQueryText: 'You can try searching for',
					reportMissingResultsText: 'Do you think this query should have results?',
					reportMissingResultsLinkText: 'Click to report'
				}
			}
		}
	}
}
