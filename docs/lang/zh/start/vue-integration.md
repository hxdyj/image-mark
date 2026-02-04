---
layout: doc
footer: false
---

# Vue 集成指南

本节介绍如何在 Vue 3 项目中正确集成 mark-img，包括实例管理、响应式状态同步和常见模式。所有示例均使用 `<script setup>` + TypeScript。

## 基础集成

```vue
<template>
	<div ref="containerRef" style="width: 100%; height: 500px" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ImageMark from 'mark-img'
import 'mark-img/dist/style.css'

const props = defineProps<{
	src: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let imgMark: ImageMark | null = null

onMounted(() => {
	imgMark = new ImageMark({
		el: containerRef.value!,
		src: props.src,
		pluginOptions: {
			shape: {
				shapeList: [],
			},
		},
	})
})

onUnmounted(() => {
	imgMark?.destroy()
})
</script>
```

::: tip
`ImageMark` 实例不需要用 `ref()` 包裹为响应式对象，直接用普通变量存储即可。将其包裹为响应式会带来不必要的性能开销。
:::

## 响应式状态同步

将 mark-img 的状态同步到 Vue 响应式数据：

```vue
<template>
	<div>
		<div>缩放: {{ (scale * 100).toFixed(0) }}%</div>
		<div>可撤销: {{ historyInfo.undo }} 步</div>
		<div v-if="isDrawing">绘制中...</div>
		<div ref="containerRef" style="width: 100%; height: 500px" />
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ImageMark from 'mark-img'

const props = defineProps<{
	src: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let imgMark: ImageMark | null = null

const scale = ref(1)
const historyInfo = ref({ undo: 0, redo: 0 })
const isDrawing = ref(false)

onMounted(() => {
	imgMark = new ImageMark({
		el: containerRef.value!,
		src: props.src,
		pluginOptions: {
			shape: { shapeList: [] },
		},
	})
		.on('scale', (s) => { scale.value = s })
		.on('history_change', (info) => { historyInfo.value = info })
		.on('shape_start_drawing', () => { isDrawing.value = true })
		.on('shape_end_drawing', () => { isDrawing.value = false })
})

onUnmounted(() => {
	imgMark?.destroy()
})
</script>
```

## 绘制工具栏

```vue
<template>
	<div>
		<button @click="drawShape(ImageMarkRect, { shapeName: 'rect', x: 0, y: 0, width: 0, height: 0 })">
			矩形
		</button>
		<button @click="drawShape(ImageMarkCircle, { shapeName: 'circle', x: 0, y: 0, r: 0 })">
			圆形
		</button>
		<button @click="drawShape(ImageMarkPolygon, { shapeName: 'polygon', points: [] })">
			多边形
		</button>
	</div>
</template>

<script setup lang="ts">
import ImageMark, { ImageMarkRect, ImageMarkCircle, ImageMarkPolygon } from 'mark-img'

const props = defineProps<{
	imgMark: ImageMark | null
}>()

function drawShape(ShapeClass: any, data: any) {
	if (!props.imgMark) return
	props.imgMark.getShapePlugin()?.startDrawing(new ShapeClass(data, props.imgMark))
}
</script>
```

## 撤销/重做按钮

```vue
<template>
	<div>
		<button :disabled="historyInfo.undo === 0" @click="imgMark?.getHistoryPlugin()?.undo()">
			撤销 ({{ historyInfo.undo }})
		</button>
		<button :disabled="historyInfo.redo === 0" @click="imgMark?.getHistoryPlugin()?.redo()">
			重做 ({{ historyInfo.redo }})
		</button>
	</div>
</template>

<script setup lang="ts">
import ImageMark from 'mark-img'

defineProps<{
	imgMark: ImageMark | null
	historyInfo: { undo: number; redo: number }
}>()
</script>
```

## 只读与选择模式切换

```vue
<template>
	<div>
		<label>
			<input type="checkbox" v-model="readonly" />
			只读模式
		</label>
		<select v-model="selectMode">
			<option value="single">单选</option>
			<option value="multiple">多选</option>
		</select>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ImageMark from 'mark-img'

const props = defineProps<{
	imgMark: ImageMark | null
}>()

const readonly = ref(false)
const selectMode = ref('single')

watch(readonly, (val) => {
	props.imgMark?.setReadonly(val)
})

watch(selectMode, (val) => {
	props.imgMark?.getSelectionPlugin()?.mode(val)
})
</script>
```

## 右键菜单

通过监听事件实现自定义右键菜单：

```vue
<template>
	<div>
		<div ref="containerRef" style="width: 100%; height: 500px" />
		<div
			v-if="contextMenu"
			:style="{ position: 'fixed', left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
		>
			<button v-if="contextMenu.type === 'shape'" @click="handleDelete">删除</button>
			<button v-if="contextMenu.type === 'container'" @click="handleDeleteAll">删除全部</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ImageMark, { ImageMarkShape } from 'mark-img'

const containerRef = ref<HTMLDivElement | null>(null)
let imgMark: ImageMark | null = null
let tmpShape: ImageMarkShape | null = null

const contextMenu = ref<{ x: number; y: number; type: 'shape' | 'container' } | null>(null)

function hideMenu() {
	contextMenu.value = null
}

function handleDelete() {
	if (tmpShape) {
		imgMark?.getShapePlugin()?.removeNode(tmpShape)
	}
	contextMenu.value = null
}

function handleDeleteAll() {
	imgMark?.getShapePlugin()?.removeAllNodes()
	contextMenu.value = null
}

onMounted(() => {
	imgMark = new ImageMark({
		el: containerRef.value!,
		src: './example.jpg',
		pluginOptions: {
			shape: { shapeList: [] },
		},
	})
		.on('shape_context_menu', (evt, shapeInstance) => {
			evt.preventDefault()
			tmpShape = shapeInstance
			contextMenu.value = { x: evt.clientX, y: evt.clientY, type: 'shape' }
		})
		.on('container_context_menu', (evt) => {
			evt.preventDefault()
			contextMenu.value = { x: evt.clientX, y: evt.clientY, type: 'container' }
		})

	document.addEventListener('click', hideMenu)
})

onUnmounted(() => {
	imgMark?.destroy()
	document.removeEventListener('click', hideMenu)
})
</script>
```

## 数据持久化

结合 localStorage 实现数据自动保存和恢复：

```vue
<template>
	<div ref="containerRef" style="width: 100%; height: 500px" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import ImageMark from 'mark-img'

const props = defineProps<{
	src: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let imgMark: ImageMark | null = null

const initData = JSON.parse(localStorage.getItem('shapeList') || '[]')

const autoSave = debounce(() => {
	const data = imgMark?.getShapePlugin()?.data || []
	localStorage.setItem('shapeList', JSON.stringify(data))
}, 300)

onMounted(() => {
	imgMark = new ImageMark({
		el: containerRef.value!,
		src: props.src,
		pluginOptions: {
			shape: { shapeList: initData },
		},
	}).on('shape_plugin_data_change', autoSave)
})

onUnmounted(() => {
	imgMark?.destroy()
})
</script>
```

## 图片源切换

当图片 `src` 变化时，需要销毁旧实例并创建新实例。推荐使用 `key` 强制重新挂载组件：

```vue
<!-- 父组件 -->
<template>
	<ImageAnnotator :src="currentSrc" :key="currentSrc" />
</template>
```

也可以通过 `watch` 手动管理：

```vue
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import ImageMark from 'mark-img'

const props = defineProps<{
	src: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
let imgMark: ImageMark | null = null

function initImageMark() {
	imgMark?.destroy()
	imgMark = new ImageMark({
		el: containerRef.value!,
		src: props.src,
		pluginOptions: {
			shape: { shapeList: [] },
		},
	})
}

onMounted(() => {
	initImageMark()
})

watch(() => props.src, () => {
	initImageMark()
})

onUnmounted(() => {
	imgMark?.destroy()
})
</script>
```

完整的 Vue 集成示例可以参考项目源码中的 `src_vue/views/Swiper/components/MarkImg.vue`。
