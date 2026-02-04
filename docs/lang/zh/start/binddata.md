---
layout: doc
footer: false
---

# 图形数据管理

学会绘制图形后，下一步是管理图形的数据，包括修改标签、分类、删除和批量操作等。

## 修改图形标签

通过 `startModifyData()` 和 `updateData()` 方法修改图形数据：

```ts
// 获取图形实例
const shapePlugin = imgMark.getShapePlugin()
const shapeInstance = shapePlugin?.getInstanceByData(shapeData)

// 开始修改（保存快照，用于撤销）
shapeInstance?.startModifyData()

// 修改标签
const data = shapeInstance?.data
data.label = '新标签'

// 提交修改
shapeInstance?.updateData(data)
```

::: tip
调用 `startModifyData()` 会保存当前数据快照，配合 [History 插件](/api/plugin/history) 可支持撤销操作。
:::

## 自定义字段

mark-img 的图形数据支持任意自定义字段。例如，如果你的业务需要分类功能，可以添加 `category_id` 字段：

```ts
// 绘制时添加自定义字段
imgMark.getShapePlugin()?.startDrawing(new ImageMarkRect({
	shapeName: 'rect',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	category_id: 'car',  // 自定义字段
	priority: 1,          // 可以添加任意字段
}, imgMark))

// 修改自定义字段
shapeInstance?.startModifyData()
const data = shapeInstance?.data
data.category_id = 'truck'
data.priority = 2
shapeInstance?.updateData(data)
```

::: tip
mark-img 本身不处理这些自定义字段的业务逻辑（如分类列表管理、颜色映射等），完全由你的应用层控制。mark-img 只负责存储和传递这些数据。
:::

## 删除图形

```ts
const shapePlugin = imgMark.getShapePlugin()

// 删除单个图形（通过实例）
shapePlugin?.removeNode(shapeInstance)

// 删除单个图形（通过数据）
shapePlugin?.removeNode(shapeData)

// 批量删除
shapePlugin?.removeNodes(shapeInstances)

// 删除所有图形
shapePlugin?.removeAllNodes()
```

## 通过数据获取图形实例

```ts
const shapePlugin = imgMark.getShapePlugin()

// 通过 data 获取 shape instance
const shapeInstance = shapePlugin?.getInstanceByData(shapeData)
```

## 监听数据变化

通过事件监听图形数据的变化，完整事件列表见 [事件 API](/api/constructor-on)。

```ts
const imgMark = new ImageMark({ /* ... */ })
	// 图形被添加时
	.on('shape_add', (data, shapeInstance) => {
		console.log('新增图形', data)
	})
	// 图形数据被更新时
	.on('shape_update_data', (newData, oldData) => {
		console.log('数据变化', oldData, '->', newData)
	})
	// 图形被删除时
	.on('shape_delete', (shapeInstance) => {
		console.log('删除图形', shapeInstance.data)
	})
	// 批量删除时
	.on('shape_delete_patch', (shapeInstances) => {
		console.log('批量删除', shapeInstances.length, '个图形')
	})
	// 数据发生任何变化时（增删改都会触发）
	.on('shape_plugin_data_change', (data) => {
		console.log('当前数据', data)
	})
```

## 替换全部数据

```ts
// 用新数据替换所有图形
imgMark.getShapePlugin()?.setData([
	{ shapeName: 'rect', x: 100, y: 100, width: 200, height: 150, label: '目标A' },
	{ shapeName: 'circle', x: 300, y: 200, r: 80, label: '目标B' },
])
```

更多方法请查看 [Shape Plugin API](/api/plugin/shape) 和 [Shape 类 API](/api/shape-class)。
