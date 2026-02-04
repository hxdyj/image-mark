---
layout: doc
footer: false
---

# Vue Integration Guide

This section covers how to properly integrate mark-img in Vue 3 projects, including instance management, reactive state synchronization, and common patterns. All examples use `<script setup>` + TypeScript.

## Basic Integration

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
The `ImageMark` instance doesn't need to be wrapped with `ref()` as a reactive object — a plain variable is sufficient. Wrapping it as reactive would add unnecessary performance overhead.
:::

## Reactive State Synchronization

Sync mark-img state to Vue reactive data:

```vue
<template>
	<div>
		<div>Scale: {{ (scale * 100).toFixed(0) }}%</div>
		<div>Undoable: {{ historyInfo.undo }} steps</div>
		<div v-if="isDrawing">Drawing...</div>
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

## Drawing Toolbar

```vue
<template>
	<div>
		<button @click="drawShape(ImageMarkRect, { shapeName: 'rect', x: 0, y: 0, width: 0, height: 0 })">
			Rect
		</button>
		<button @click="drawShape(ImageMarkCircle, { shapeName: 'circle', x: 0, y: 0, r: 0 })">
			Circle
		</button>
		<button @click="drawShape(ImageMarkPolygon, { shapeName: 'polygon', points: [] })">
			Polygon
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

## Undo/Redo Buttons

```vue
<template>
	<div>
		<button :disabled="historyInfo.undo === 0" @click="imgMark?.getHistoryPlugin()?.undo()">
			Undo ({{ historyInfo.undo }})
		</button>
		<button :disabled="historyInfo.redo === 0" @click="imgMark?.getHistoryPlugin()?.redo()">
			Redo ({{ historyInfo.redo }})
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

## Readonly & Selection Mode

```vue
<template>
	<div>
		<label>
			<input type="checkbox" v-model="readonly" />
			Readonly Mode
		</label>
		<select v-model="selectMode">
			<option value="single">Single</option>
			<option value="multiple">Multiple</option>
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

## Context Menu

Implement a custom context menu via event listeners:

```vue
<template>
	<div>
		<div ref="containerRef" style="width: 100%; height: 500px" />
		<div
			v-if="contextMenu"
			:style="{ position: 'fixed', left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
		>
			<button v-if="contextMenu.type === 'shape'" @click="handleDelete">Delete</button>
			<button v-if="contextMenu.type === 'container'" @click="handleDeleteAll">Delete All</button>
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

## Data Persistence

Combine with localStorage for auto-save and restore:

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

## Switching Image Source

When image `src` changes, destroy the old instance and create a new one. The recommended approach is using `key` to force component remount:

```vue
<!-- Parent component -->
<template>
	<ImageAnnotator :src="currentSrc" :key="currentSrc" />
</template>
```

Alternatively, manage manually with `watch`:

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

For a complete Vue integration example, see `src_vue/views/Swiper/components/MarkImg.vue` in the project source.
