---
layout: doc
footer: false
---

# 自定义图形样式

通过 `shapeOptions` 可以自定义图形的边框颜色、标签样式、辅助线等外观。关于 `ShapeOptions` 和 `ShapeAttr` 的完整类型定义，请查看 [Shape 类 API](/api/shape-class)。

## 通过 setAttr 自定义属性

`setAttr` 在每次绘制时调用，返回图形的样式属性：

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				setAttr(shapeInstance) {
					return {
						stroke: {
							color: '#FF0000',   // 边框颜色
							width: 3,            // 边框宽度
						},
						fill: 'rgba(255, 0, 0, 0.1)',  // 填充色
						label: {
							font: {
								fill: '#FFFFFF', // 标签字体颜色
								size: 16,        // 标签字体大小
							},
							fill: '#FF0000',     // 标签背景色
						},
						auxiliary: {
							stroke: {
								color: '#FADC19', // 辅助线颜色（如多边形绘制时的提示线）
							},
						},
					}
				},
			},
		},
	},
})
```

## 根据自定义字段设置不同颜色

结合 `initDrawFunc` 可以根据图形数据中的自定义字段动态设置样式。例如，利用自定义的 `category_id` 字段区分颜色：

```ts
const categoryColors = {
	car: '#FF0000',
	person: '#00FF00',
	building: '#0000FF',
}

const shapeOptions = {
	initDrawFunc(shapeInstance) {
		const categoryId = shapeInstance.data.category_id
		const color = categoryColors[categoryId] || '#FF7D00'

		// 设置边框颜色
		shapeInstance.getMainShape()?.stroke({ color })

		// 设置标签背景色
		shapeInstance.getLabelShape()?.find('rect')[0]?.fill(color)
	},
}

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions,
		},
	},
})
```

## afterRender 回调

`afterRender` 在图形 DOM 渲染完成后调用，可用于添加额外的交互：

```ts
const shapeOptions = {
	afterRender(shapeInstance) {
		// DOM 已渲染，可以做额外操作
		console.log('图形已渲染', shapeInstance.data.shapeName)
	},
}
```

## 控制编辑行为

`ShapeOptions` 还可以控制图形的编辑权限：

```ts
const shapeOptions = {
	// 控制是否允许编辑
	enableEdit(shapeInstance) {
		// 例如：只允许编辑矩形
		return shapeInstance.data.shapeName === 'rect'
	},

	// 控制折线/多边形编辑时是否允许添加中位点
	enableEditAddMidPoint(shapeInstance) {
		return true
	},

	// 控制折线/多边形编辑时是否允许右键删除顶点
	enableEditDropPoint(shapeInstance) {
		return true
	},
}
```
