<template>
	<div style="background-color: #f2f3f5;height: 30vh;">
		<a-button @click="() => {
			imgMark?.move([50, 0])
		}">move x +</a-button>
		<a-button @click="() => {
			imgMark?.move([-50, 0])
		}">move x -</a-button>
		<a-button @click="() => {
			imgMark?.move([0, 50])
		}">move y +</a-button>
		<a-button @click="() => {
			imgMark?.move([0, -50])
		}">move y -</a-button>

		<a-button @click="() => {
			moveSuccessive = [0, 0]
			imgMark?.startSuccessiveMove([0, 0])
		}">start move successive</a-button>

		<a-button @click="() => {
			moveSuccessive = [0, 0]
			imgMark?.endSuccessiveMove()
		}">end move successive</a-button>

		<a-button @click="() => {
			moveSuccessive[1] += 50
			imgMark?.moveSuccessive(moveSuccessive)
		}">move successive y +</a-button>

		<a-button @click="() => {
			moveSuccessive[1] -= 50
			imgMark?.moveSuccessive(moveSuccessive)
		}">move successive y -</a-button>

		<a-button @click="() => {
			moveSuccessive[0] += 50
			imgMark?.moveSuccessive(moveSuccessive)
		}">move successive x +</a-button>

		<a-button @click="() => {
			moveSuccessive[0] -= 50
			imgMark?.moveSuccessive(moveSuccessive)
		}">move successive x -</a-button>


		<a-button @click="() => {
			imgMark?.scale(-1, 'center', 'image')
		}">scale image center -</a-button>
		<a-button @click="() => {
			imgMark?.scaleTo({
				to: 'image',
				size: 'cover',
			}, [50, 50], 'image')
		}">scale to cover -</a-button>
	</div>
	<div class="page-base" style="height: 60vh;">
	</div>
	<div class="h-[80vh] bg-[#86909c]"></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrayPoint, ImageMark } from '../../package/index';
let imgMark: ImageMark | null = null


let moveSuccessive: ArrayPoint = [0, 0]

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
		enableImageOutOfContainer: false,
		moveConfig: {
		},
		initScaleConfig: {
			startPosition: 'center',
			size: 'fit',
			// to: 'box',
			// box: {
			// 	x: 1270,
			// 	y: 626,
			// 	width: 20,
			// 	height: 20,
			// },
			// box: {
			// 	x: 50,
			// 	y: 50,
			// 	width: 100,
			// 	height: 100,
			// },
			// padding: 50,
			paddingUnit: 'px'
		}
	}).on('firstRender', () => {
		// imgMark?.setMinScale('cover')
		// imgMark?.removeStageLmbDownMoveing()
	})
})
</script>
<style scoped lang="scss">
.page-base {}
</style>
