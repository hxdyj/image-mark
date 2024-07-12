<template>
	<div class="page-map flex h-[100vh]">
		<div class="flex-grow relative">
			<div id="map" class="w-full h-full"></div>
			<div class=" absolute left-0 top-0 p-2 text-white bg-[#333333] rounded-md" v-if="cordinary">Cordinary ( {{
				cordinary[0] }} , {{ cordinary[1] }})</div>
		</div>
		<div class="tree-panel flex-shrink-0 w-[300px]">
			<a-tree blockNode :data="treeData" draggable :allow-drop="onAllowDrop" @drag-start="onDragStart"
				@drag-over="onDragOver" @drag-end="onDragEnd" />
			<!-- <p draggable="true" @dragstart="onDragStart">Drag Me</p> -->
		</div>
	</div>
	<div id="drag-tree-node-ghost"
		class="fixed bottom-0 left-0 text-center text-white bg-[#EF7100] px-4 py-2 rounded-md -z-10">I am flying
	</div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ImageMark } from '../../package/index';
import { TreeNodeData } from '@arco-design/web-vue';
import { ref } from 'vue';
import { ArrayPoint } from '../../package';
import { TeamMarkPlugin } from '../components/ImageMark/plugins/TeamMarkPlugin';
import { TeamShape } from '../components/ImageMark/shape/TeamShape';
TeamMarkPlugin.registerShape(TeamShape)
ImageMark.usePlugin(TeamMarkPlugin)

let imgMark: ImageMark | null = null
let cordinary = ref<null | ArrayPoint>(null)

function onAllowDrop(_options: { dropNode: TreeNodeData; dropPosition: -1 | 0 | 1; }) {
	return false
}

function onDragOver(ev: DragEvent, node: TreeNodeData) {
	debugger
	if (ev?.dataTransfer) {
		ev.dataTransfer.dropEffect = 'none'
	}
}

function onDragStart(ev: DragEvent, node: TreeNodeData) {
	const ghostEle = document.querySelector('#drag-tree-node-ghost')
	if (ghostEle) {
		ghostEle.textContent = node.title || 'No Title'
		ev.dataTransfer?.setData('text', ghostEle.textContent)
		const rect = ghostEle.getBoundingClientRect()
		ev.dataTransfer?.setDragImage(ghostEle, rect.width / 2, rect.height)
	}
}

function onDragEnd() {
	cordinary.value = null
}

const treeData = [
	{
		title: 'Trunk 0-0',
		key: '0-0',
		children: [
			{
				title: 'Branch 0-0-0',
				key: '0-0-0',
				children: [
					{
						title: 'Leaf1',
						key: '0-0-0-0',
					},
					{
						title: 'Leaf2',
						key: '0-0-0-1',
					}
				]
			},
			{
				title: 'Branch 0-0-1',
				key: '0-0-1',
				children: [
					{
						title: 'Leaf3',
						key: '0-0-1-0',
					},
				]
			},
		],
	},
];
onMounted(() => {
	imgMark = new ImageMark({
		el: '#map',
		src: '/map.jpg',
		enableImageOutOfContainer: false,
		moveConfig: {
		},
		initScaleConfig: {
			startPosition: 'center',
			size: 'cover',
			paddingUnit: 'px'
		}
	}).on('first_render', () => {
	}).on('container_drag_over', (e: any) => {
		cordinary.value = [parseInt(e.imageClientX), parseInt(e.imageClientY)]
	})
})
</script>
<style scoped lang="scss">
.page-map {}
</style>
