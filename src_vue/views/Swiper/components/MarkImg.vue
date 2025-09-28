<template>
	<div class="mark-img" ref="containerRef">
	</div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import ImageMark, { Action, ImageMarkShape, LmbMoveAction, ShapePlugin } from '../../../../package/index';
import { demoData } from '../../../../src/data/fullDemo.data';
import { ShapeData } from '../../../../package/shape/Shape';

ImageMark.unuseDefaultPlugin()
ImageMark.usePlugin(ShapePlugin)
ImageMarkShape.unuseDefaultAction()
ImageMarkShape.useAction(LmbMoveAction, {
	moveable: false
})
const props = defineProps<{
	src: string
}>()


const containerRef = ref<HTMLDivElement | null>(null)
const imageMarkRef = ref<ImageMark | null>(null)
const shapeList = ref<ShapeData[]>([])
watch(() => props.src, async () => {
	shapeList.value = demoData
	imageMarkRef.value?.getShapePlugin()?.setData(shapeList.value)
}, {
	immediate: true
})

onMounted(() => {
	if (containerRef.value) {
		imageMarkRef.value = new ImageMark({
			el: containerRef.value,
			src: props.src,
			initScaleConfig: {
				padding: 0
			},
			pluginOptions: {
				[ShapePlugin.pluginName]: {
					shapeList: shapeList.value,
					shapeOptions: {
						setAttr(shapeInstance: ImageMarkShape) {
							return {
								stroke: {
									width: 2,
									color: 'red'
								}
							}
						},
					}
				}
			}
		})
		// imageMarkRef.value.getShapePlugin()?.addAction(LmbMoveAction, {
		// 	moveable: true
		// })
	}
})

onUnmounted(() => {
	imageMarkRef.value?.destroy()
})
</script>
<style scoped lang="scss">
.mark-img {
	width: 100%;
	height: 100%;
}
</style>
