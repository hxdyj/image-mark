---
layout: doc
footer: false
---

# 如何监听事件

mark-img 基于事件驱动，通过 `.on()` 方法监听各种事件来响应用户操作。完整事件列表见 [事件 API](/api/constructor-on)。

## 基本用法

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: { shapeList: [] },
	},
})
```

支持链式调用：

```ts
imgMark
	.on('shape_add', (data, shapeInstance) => { /* ... */ })
	.on('scale', (scale) => { /* ... */ })
	.on('readonly_change', (readonly) => { /* ... */ })
```

## 常用事件示例

### 图形生命周期

```ts
// 图形被添加（鼠标绘制完成后触发）
imgMark.on('shape_add', (data, shapeInstance) => {
	console.log('新增图形', data.shapeName, data)
})

// 图形数据被更新
imgMark.on('shape_update_data', (newData, oldData) => {
	console.log('数据变化', oldData, '->', newData)
})

// 图形被删除
imgMark.on('shape_delete', (shapeInstance) => {
	console.log('删除图形', shapeInstance.data)
})

// 数据发生任何变化（增删改都会触发）
imgMark.on('shape_plugin_data_change', (data) => {
	console.log('当前所有数据', data)
})
```

### 绘制过程

```ts
// 开始绘制
imgMark.on('shape_start_drawing', (shapeInstance) => {
	console.log('开始绘制', shapeInstance.data.shapeName)
})

// 结束绘制（cancel 为 true 表示取消）
imgMark.on('shape_end_drawing', (cancel, data) => {
	if (cancel) {
		console.log('取消绘制')
	} else {
		console.log('绘制完成', data)
	}
})
```

### 选中与交互

```ts
// 选中列表变化
imgMark.on('selection_select_list_change', (list) => {
	console.log('选中了', list.length, '个图形')
})

// 图形被点击
imgMark.on('shape_click', (evt, shapeInstance) => {
	console.log('点击了图形', shapeInstance.data)
})

// 图形移动
imgMark.on('shape_start_move', (shapeInstance) => {
	console.log('开始移动')
})

imgMark.on('shape_end_move', (shapeInstance, [diffX, diffY]) => {
	console.log('移动结束，偏移', diffX, diffY)
})
```

### 右键菜单

```ts
// 图形上右键
imgMark.on('shape_context_menu', (evt, shapeInstance) => {
	evt.preventDefault()
	// 显示自定义右键菜单
	showContextMenu(evt.clientX, evt.clientY, shapeInstance)
})

// 容器上右键
imgMark.on('container_context_menu', (evt) => {
	evt.preventDefault()
	showContainerMenu(evt.clientX, evt.clientY)
})
```

### 视图与状态

```ts
// 缩放变化
imgMark.on('scale', (scale) => {
	console.log('缩放比例', (scale * 100).toFixed(0) + '%')
})

// 只读状态变化
imgMark.on('readonly_change', (readonly) => {
	console.log('只读模式', readonly)
})

// 历史记录变化
imgMark.on('history_change', (info) => {
	console.log('可撤销', info.undo, '可重做', info.redo)
})

// 首次渲染完成（适合做初始化操作）
imgMark.on('first_render', () => {
	console.log('渲染完成')
})
```

## 取消监听

```ts
function onScale(scale) {
	console.log(scale)
}

imgMark.on('scale', onScale)

// 取消监听
imgMark.off('scale', onScale)
```
