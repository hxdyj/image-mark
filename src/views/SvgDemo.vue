<template>
	<div class="page-svg-demo" @mousemove="onMouseOver">
		<div class="h-[100vh] bg-gray-500">
		</div>
		<div class="w-[1px] fixed h-[100vh] bg-red-500 top-0 left-[890px]"></div>
		<div class=" fixed left-0 top-0">
			<div>
				Svg Point {{ point }}
			</div>
			<div>
				Image Point {{ imagePoint }}
			</div>
		</div>
		<div class="svg-container w-[890px] h-[724px]">

		</div>
		<div class="h-[100px] bg-gray-500"></div>
	</div>

</template>
<script setup lang="ts">
import { G, Image, Point, Svg, SVG } from '@svgdotjs/svg.js';
import { ref } from 'vue';
import { onMounted } from 'vue';

let svgRef = ref<Svg | null>(null)
let imageRef = ref<Image | null>(null)
let point = ref<Point | undefined>(undefined)
let imagePoint = ref<Point | undefined>(undefined)
function onMouseOver(e: MouseEvent) {
	point.value = svgRef.value?.point(e.clientX, e.clientY)
	imagePoint.value = imageRef.value?.point(e.clientX, e.clientY)
}

onMounted(() => {
	svgRef.value = SVG()
	svgRef.value.size(890, 724).css({ 'background-color': 'red' })
	svgRef.value.addTo('.svg-container')

	const g = new G()
	imageRef.value = new Image()
	imageRef.value.load('/map.jpg')
	imageRef.value.size(1280, 948)
	g.add(imageRef.value)
	g.transform({
		scale: 0.5,
		origin: [0, 0],
		translate: [250, 250]
	})

	svgRef.value?.add(g)

})
</script>
<style scoped lang="scss">
.page-svg-demo {}
</style>
