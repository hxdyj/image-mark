import { DefaultTheme, defineConfig } from 'vitepress'
import pkg from '../../../package.json'
export const en = defineConfig({
	lang: 'en-US',
	description: 'Vite & Vue powered static site generator.',

	themeConfig: {
		nav: nav(),

		sidebar: {
			'/guide/': { base: '/guide/', items: sidebarGuide() },
			'/reference/': { base: '/reference/', items: sidebarReference() }
		},

		editLink: {
			pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
			text: 'Edit this page on GitHub'
		},

		footer: {
			message: 'Released under the <a href="https://github.com/hxdyj/image-mark/blob/main/LICENSE">MIT License</a>.',
			copyright: `Copyright © 2025-present <a href="https://github.com/hxdyj">hxdyj</a>`
		}
	}
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: 'Guide',
			link: '/en/guide/what-is-vitepress',
			activeMatch: '/en/guide/'
		},
		{
			text: 'Reference',
			link: '/en/reference/site-config',
			activeMatch: '/en/reference/'
		},
		{
			text: pkg.version,
			items: [
				{
					text: 'Changelog',
					link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
				},
				{
					text: 'Contributing',
					link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
				}
			]
		}
	]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Introduction',
			collapsed: false,
			items: [
				{ text: 'What is VitePress?', link: 'what-is-vitepress' },
				{ text: 'Getting Started', link: 'getting-started' },
				{ text: 'Routing', link: 'routing' },
				{ text: 'Deploy', link: 'deploy' }
			]
		},
		{
			text: 'Writing',
			collapsed: false,
			items: [
				{ text: 'Markdown Extensions', link: 'markdown' },
				{ text: 'Asset Handling', link: 'asset-handling' },
				{ text: 'Frontmatter', link: 'frontmatter' },
				{ text: 'Using Vue in Markdown', link: 'using-vue' },
				{ text: 'Internationalization', link: 'i18n' }
			]
		},
		{
			text: 'Customization',
			collapsed: false,
			items: [
				{ text: 'Using a Custom Theme', link: 'custom-theme' },
				{
					text: 'Extending the Default Theme',
					link: 'extending-default-theme'
				},
				{ text: 'Build-Time Data Loading', link: 'data-loading' },
				{ text: 'SSR Compatibility', link: 'ssr-compat' },
				{ text: 'Connecting to a CMS', link: 'cms' }
			]
		},
		{
			text: 'Experimental',
			collapsed: false,
			items: [
				{ text: 'MPA Mode', link: 'mpa-mode' },
				{ text: 'Sitemap Generation', link: 'sitemap-generation' }
			]
		},
		{ text: 'Config & API Reference', base: '/reference/', link: 'site-config' }
	]
}

function sidebarReference(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Reference',
			items: [
				{ text: 'Site Config', link: 'site-config' },
				{ text: 'Frontmatter Config', link: 'frontmatter-config' },
				{ text: 'Runtime API', link: 'runtime-api' },
				{ text: 'CLI', link: 'cli' },
				{
					text: 'Default Theme',
					base: '/reference/default-theme-',
					items: [
						{ text: 'Overview', link: 'config' },
						{ text: 'Nav', link: 'nav' },
						{ text: 'Sidebar', link: 'sidebar' },
						{ text: 'Home Page', link: 'home-page' },
						{ text: 'Footer', link: 'footer' },
						{ text: 'Layout', link: 'layout' },
						{ text: 'Badge', link: 'badge' },
						{ text: 'Team Page', link: 'team-page' },
						{ text: 'Prev / Next Links', link: 'prev-next-links' },
						{ text: 'Edit Link', link: 'edit-link' },
						{ text: 'Last Updated Timestamp', link: 'last-updated' },
						{ text: 'Search', link: 'search' },
						{ text: 'Carbon Ads', link: 'carbon-ads' }
					]
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
