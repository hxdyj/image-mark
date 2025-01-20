import { defineConfig } from 'vitepress'
import { search as enSearch } from './en'
import { search as zhSearch } from './zh'

export const shared = defineConfig({
	title: 'ImageMark',
	lastUpdated: true,
	cleanUrls: true,
	metaChunk: true,
	srcDir: 'lang',
	rewrites: {
		"zh/:rest*": ":rest*",
	},
	// sitemap: {
	// 	hostname: 'https://vitepress.dev',
	// 	transformItems(items) {
	// 		return items.filter((item) => !item.url.includes('migration'))
	// 	}
	// },
	themeConfig: {

		search: {
			provider: 'local',
			options: {
				locales: {
					root: {
						...zhSearch!.zh
					},
					...zhSearch,
					...enSearch,

				},
				miniSearch: {
					/**
					 * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
					 */
					options: {
						/* ... */
					},
					/**
					 * @type {import('minisearch').SearchOptions}
					 * @default
					 * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
					 */
					searchOptions: {

						/* ... */
					}
				}
			},

		},
	},
	vite: {
		plugins: [
		]
	}
})
