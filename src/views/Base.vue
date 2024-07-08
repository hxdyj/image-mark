<template>
	<div style="background-color: #f2f3f5;height: 30vh;">
		<a-button @click="() => {
			imgMark?.move([50, 0])
		}">move x +</a-button>
		<a-button @click="() => {
			imgMark?.move([-50, 0])
		}">move x -</a-button>
	</div>
	<div class="page-base" style="height: 60vh;">
	</div>
	<div class="h-[80vh] bg-[#86909c]"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ImageMark } from '../../package/index';
let imgMark: ImageMark | null = null
onMounted(() => {
	imgMark = new ImageMark({
		el: '.page-base',
		src: '/2.png',
		data: [
			{
				x: 50,
				y: 50,
				width: 100,
				height: 100,
				type: 'rect'
			},
			{
				x: 400,
				y: 400,
				width: 100,
				height: 100,
				type: 'rect'
			},
		],
		initScaleConfig: {
			startPosition: 'center',
			size: 'height',
			to: 'box',
			box: {
				x: 400,
				y: 400,
				width: 100,
				height: 100,
			},
			padding: 50,
			paddingUnit: 'px'
		}
	}).on('firstRender', () => {
		// imgMark?.removeStageLmbDownMoveing()
	})
})
</script>
<style scoped lang="scss">
.page-base {}
</style>
