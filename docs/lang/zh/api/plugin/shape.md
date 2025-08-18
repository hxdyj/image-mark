---
layout: doc
footer: false
---

# Shape Plugin

此插件是最基础的插件，主要用于管理 `Shape` 的数据和实例，以及 `Shape` 注册、鼠标绘制时的鼠标事件记录，方便 `Shape` 实例利用鼠标绘制路径数据来绘制。

## Types

```typescript
export interface ShapeData {
	shapeName: string
	transform?: ShapeTransform
	label?: string
	[x: string]: any
}

export type ShapeAttr =
	| {
			stroke?: StrokeData
			fill?: string
			//辅助线
			auxiliary?: {
				stroke?: StrokeData
			}
			label?: {
				font?: {
					fill?: string
					size?: number
				}
				fill?: string
			}
			dot?: {
				//点的半径
				r?: number
			}
	  }
	| undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr // 自定义 shape 的属性
	afterRender?: (shapeInstance: ImageMarkShape) => void
	initDrawFunc?: ShapeDrawFunc
}
```

## Options

```ts
export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
	shapeList: T[]
	shapeOptions?: ShapeOptions
}
```

在 `ImageMark` 实例上注册 `shape` 插件时，可以传入 `shapeList` 数组，用来初始化插件实例。
此插件可以使用内置的多个 `Shape`，也可以通过 `useShape` 方法使用自定义的 `Shape`。

## 使用 Shape 示例

### class 方式

```ts
import { ShapePlugin, ImageMarkRect } from 'mark-img'
ShapePlugin.useShape(ImageMarkRect, {
	// shape options
})
```

### 实例方式

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				// shape options
			},
		},
	},
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance, {
		// shape options
	})
	shapePluginInstance.addShape(ImageMarkRect, {
		// shape options
	})
})
```

## 静态属性

### pluginName

`shape`

### shapeList

类上边 `shape` 的数组

## 静态方法

### useShape

参数：(

- shape: `typeof ImageMarkShape<T>`,
- shapeOptions?: ShapeOptions

)

使用 Shape

### unuseShape

参数：`(shape: typeof ImageMarkShape<T>)`

移除 Shape

### hasShape

参数：`(shape: typeof ImageMarkShape<T>)`

是否使用了某个 Shape

### useDefaultShape

使用所有内置的 Shape

### unuseDefaultShape

移除所有内置的 Shape

## 实例属性

### data

数组类型，存放所有 shape 数据

### disableActionList

Set 类型，存放所有禁用的 action

### shape

```ts
shape: {
	[key: string]: {
		ShapeClass: ImageMarkShape,
		shapeOptions?: ShapeOptions
	}
}
```

存放当前插件实例使用的 shape class 和 shape options

### drawingShape

正在绘制中的（比如鼠标绘制）Shape 实例

### programmaticDrawing

是否是编程式绘制中

### drawingMouseTrace

类型：`Array<MouseEvent>`

鼠标绘制过程中鼠标事件记录

## 实例方法

### getLabelShape

获取 Label 的 shape 实例

### getLabelId

获取 Label shape 的 id

### setData

参数：`(data: T[])`

设置 shape 数据

### removeNode

参数：`(data: T)`

移除某个 shape

### removeAllNodes

参数：`(emit = true)`

移除所有 shape

### getShapeOptions

参数：`(shapeOptions?: ShapeOptions)`

获取 shape options

### redrawNodes

重新渲染所有 shape

### disableAction

参数：`(action: string | string[])`

禁用某些 action

### enableAction

参数：`(action: string | string[])`

不禁用某些 action

### destroy

销毁插件实例

### onAdd

参数：`(data: T, emit = true)`

添加 shape

### onDelete

参数：`(data: T, shapeInstance: ImageMarkShape)`

删除 shape

### clear

清除所有 shape

### getInstanceByData

参数：`(data: T)`

通过 data 获取 shape instance

### addShape

参数：(

- shape: `typeof ImageMarkShape<T>`,
- shapeOptions?: ShapeOptions

)

实例上添加 shape

### removeShape

实例上删除 shape

### startDrawing

参数：`(shape: ImageMarkShape<T>, programmaticDrawing = false)`

开始绘制 shape

### drawing

参数： `(shapeData: T)`

绘制绘制中的 shape

### endDrawing

参数: `(cancel = false)`

完成绘制，cancel 为 `true` 时不添加到 `data`

### dropLastMouseTrace

删除鼠标最后一个的事件，绘制过程中回退使用

### addAction

参数：`(action: typeof Action, actionOptions: any = {})`

添加实例动作

### removeAction

参数：`(action: typeof Action)`

移除实例动作
