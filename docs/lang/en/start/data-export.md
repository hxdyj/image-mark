---
layout: doc
footer: false
---

# Data Import & Export

mark-img's shape data is pure JSON, making it easy to serialize, persist, and transmit.

## Exporting Data

```ts
// Get all shape data
const data = imgMark.getShapePlugin()?.data

// Convert to JSON string
const jsonStr = JSON.stringify(data, null, 2)
```

### Export as File Download

```ts
function exportData() {
	const data = imgMark.getShapePlugin()?.data
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
	const a = document.createElement('a')
	a.href = URL.createObjectURL(blob)
	a.download = 'shape-data.json'
	a.click()
}
```

## Importing Data

```ts
// Set data directly (replaces all current shapes)
imgMark.getShapePlugin()?.setData(shapeDataList)
```

### Import from File

```ts
function importData(file) {
	const reader = new FileReader()
	reader.readAsText(file, 'utf-8')
	reader.onload = () => {
		const shapeDataList = JSON.parse(reader.result)
		imgMark.getShapePlugin()?.setData(shapeDataList)
	}
}

// Use with input file
document.querySelector('#import-input').onchange = (e) => {
	const file = e.target.files[0]
	if (file) importData(file)
}
```

## localStorage Persistence

Use event listeners for auto-saving:

```ts
import { debounce } from 'lodash-es'

// Auto-save to localStorage (debounced 300ms)
const autoSave = debounce(() => {
	const data = imgMark.getShapePlugin()?.data || []
	localStorage.setItem('shapeList', JSON.stringify(data))
}, 300)

imgMark.on('shape_plugin_data_change', () => {
	autoSave()
})

// Restore from localStorage on init
const savedData = localStorage.getItem('shapeList')
const initList = savedData ? JSON.parse(savedData) : []

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: initList,
		},
	},
})
```

## Backend Integration

```ts
// Save to backend
async function saveToServer() {
	const data = imgMark.getShapePlugin()?.data
	await fetch('/api/annotations', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ imageId: 'xxx', shapes: data }),
	})
}

// Load from backend
async function loadFromServer(imageId) {
	const res = await fetch(`/api/annotations/${imageId}`)
	const { shapes } = await res.json()
	imgMark.getShapePlugin()?.setData(shapes)
}
```

## Listening to Data Changes

```ts
// Triggered on setData
imgMark.on('shape_plugin_set_data', (data) => {
	console.log('Data replaced', data)
})

// Triggered on any data change
imgMark.on('shape_plugin_data_change', (data) => {
	console.log('Data changed', data)
})
```

For data structures and full API, see [Shape Plugin API](/en/api/plugin/shape) and individual shape API docs.

