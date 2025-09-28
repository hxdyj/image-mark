<template>
	<div class="preview-img-list-mn">
		<div class="pre-img index-img" @click.stop="changeIndex(-1)">
		</div>
		<div class="next-img index-img" @click.stop="changeIndex(1)">
		</div>
		<MarkImg :src="src" :key="src" />
	</div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { clamp } from 'lodash-es';
import MarkImg from './MarkImg.vue';

const props = withDefaults(defineProps<{
	slideName: string
	selectedIndex?: number
	imageList?: Array<{
		imageUrl: string
	}>
}>(), {
	selectedIndex: 0,
	imageList: () => Array<{
		imageUrl: string
	}>()
})

const selectedIndex = ref(props.selectedIndex)

function changeIndex(step: number) {
	selectedIndex.value = clamp(selectedIndex.value + step, 0, props.imageList.length - 1)
}

const src = computed(() => {
	const image = props.imageList[selectedIndex.value]
	return image?.imageUrl || ''
})


</script>
<style scoped lang="scss">
.preview-img-list-mn {
	width: 100%;
	height: 100%;
	position: relative;

	.container {
		width: 100%;
		height: 100%;
	}

	.index-img {
		--size: 30px;
		position: absolute;
		width: var(--size);
		height: var(--size);
		border-radius: var(--size);
		background-color: #165DFF;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		z-index: 1000;

		&.pre-img {
			left: 20px;
			top: 50%;
			transform: translateY(-50%);
		}

		&.next-img {

			right: 20px;
			top: 50%;
			transform: translateY(-50%);
		}
	}
}
</style>
