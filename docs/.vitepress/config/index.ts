import { defineConfig } from 'vitepress'
import { shared } from './shared'
import { locales } from './locales'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	...shared,
	locales,
})
