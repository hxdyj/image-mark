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

```ts
// 使用 Shape
useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): ShapePlugin<T>
```

### unuseShape

```ts
// 移除 Shape
unuseShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): ShapePlugin<T>
```

### hasShape

```ts
// 是否使用了某个 Shape
hasShape(shape: typeof ImageMarkShape<T>): boolean
```

### useDefaultShape

```ts
// 使用所有内置的 Shape
useDefaultShape(): void
```

### unuseDefaultShape

```ts
// 移除所有内置的 Shape
unuseDefaultShape(): void
```

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

### setData

```ts
// 设置 shape 数据
setData(data: T[]): void
```

### removeNode

```ts
// 移除某个 shape
removeNode(data: T): void
```

### removeAllNodes

```ts
// 移除所有 shape
removeAllNodes(emit = true): void
```

### getShapeOptions

```ts
// 获取 shape options
getShapeOptions(shapeOptions?: ShapeOptions): ShapeOptions
```

### redrawNodes

```ts
// 重新渲染所有 shape
redrawNodes(): void
```

### disableAction

```ts
// 禁用某些 action
disableAction(action: string | string[]): void
```

### enableAction

```ts
// 不禁用某些 action
enableAction(action: string | string[]): void
```

### destroy

```ts
// 销毁插件实例
destroy(): void
```

### onAdd

```ts
// 添加 shape
onAdd(data: T, emit = true): void
```

### clear

```ts
// 清除所有 shape
clear(): void
```

### getInstanceByData

```ts
// 通过 data 获取 shape instance
getInstanceByData(data: T): ImageMarkShape | undefined
```

### addShape

```ts
// 实例上添加 shape
addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): ShapePlugin<T>
```

### removeShape

```ts
// 实例上删除 shape
removeShape(shape: typeof ImageMarkShape<T>): ShapePlugin<T>
```

### startDrawing

```ts
// 开始绘制 shape
startDrawing(shape: ImageMarkShape<T>, programmaticDrawing = false): ShapePlugin<T>
```

### drawing

```ts
// 绘制绘制中的 shape
drawing(shapeData: T): ShapePlugin<T>
```

### endDrawing

```ts
// 完成绘制，cancel 为 `true` 时不添加到 `data`
endDrawing(cancel = false): ShapePlugin<T>
```

### dropLastMouseTrace

```ts
// 删除鼠标最后一个的事件，绘制过程中回退使用
dropLastMouseTrace(): void
```

### addAction

```ts
// 添加实例动作
addAction(action: typeof Action, actionOptions: any = {}): void
```

### removeAction

```ts
// 移除实例动作
removeAction(action: typeof Action): void
```
