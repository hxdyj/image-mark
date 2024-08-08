<template>
	<div class="page-base" style="height: 60vh;">
	</div>
	<div class="h-[80vh] bg-[#86909c]"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ImageMark } from '../../package/index';
import { TeamMarkPlugin } from '../components/ImageMark/plugins/TeamMarkPlugin';
let imgMark: ImageMark | null = null
ImageMark.usePlugin(TeamMarkPlugin)

onMounted(() => {
	imgMark = new ImageMark({
		el: '.page-base',
		src: '/2.png',
		moveConfig: {
		},
		initScaleConfig: {
			startPosition: 'center',
			size: 'fit',
			paddingUnit: 'px'
		}
	}).on('first_render', () => {
	})

	imgMark = new ImageMark({
		el: '.page-base',
		src: '/2.png',
		moveConfig: {
		},
		initScaleConfig: {
			startPosition: 'center',
			size: 'fit',
			paddingUnit: 'px'
		}
	}).on('first_render', () => {
	})
})
</script>
<style scoped lang="scss">
.page-base {}
</style>
