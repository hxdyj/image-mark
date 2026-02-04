---
layout: doc
footer: false
---

# 数据导入导出

mark-img 的图形数据是纯 JSON 结构，可以方便地进行序列化、持久化和传输。

## 导出数据

```ts
// 获取所有图形数据
const data = imgMark.getShapePlugin()?.data

// 转为 JSON 字符串
const jsonStr = JSON.stringify(data, null, 2)
```

### 导出为文件下载

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

## 导入数据

```ts
// 直接设置数据（替换当前所有图形）
imgMark.getShapePlugin()?.setData(shapeDataList)
```

### 从文件导入

```ts
function importData(file) {
	const reader = new FileReader()
	reader.readAsText(file, 'utf-8')
	reader.onload = () => {
		const shapeDataList = JSON.parse(reader.result)
		imgMark.getShapePlugin()?.setData(shapeDataList)
	}
}

// 配合 input file 使用
document.querySelector('#import-input').onchange = (e) => {
	const file = e.target.files[0]
	if (file) importData(file)
}
```

## localStorage 持久化

利用事件监听实现自动保存：

```ts
import { debounce } from 'lodash-es'

// 自动保存到 localStorage（防抖 300ms）
const autoSave = debounce(() => {
	const data = imgMark.getShapePlugin()?.data || []
	localStorage.setItem('shapeList', JSON.stringify(data))
}, 300)

imgMark.on('shape_plugin_data_change', () => {
	autoSave()
})

// 初始化时从 localStorage 恢复
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

## 与后端交互

```ts
// 保存到后端
async function saveToServer() {
	const data = imgMark.getShapePlugin()?.data
	await fetch('/api/annotations', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ imageId: 'xxx', shapes: data }),
	})
}

// 从后端加载
async function loadFromServer(imageId) {
	const res = await fetch(`/api/annotations/${imageId}`)
	const { shapes } = await res.json()
	imgMark.getShapePlugin()?.setData(shapes)
}
```

## 监听数据变化

```ts
// setData 时触发
imgMark.on('shape_plugin_set_data', (data) => {
	console.log('数据被替换', data)
})

// 任何数据变化时触发
imgMark.on('shape_plugin_data_change', (data) => {
	console.log('数据变化', data)
})
```

关于数据结构和完整 API，请查看 [Shape Plugin API](/api/plugin/shape) 和各图形的 API 文档。
