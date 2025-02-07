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
	[x: string]: any
}

export type ShapeOptions = {
	afterRender?: (shapeInstance: ImageMarkShape) => void
	initDrawFunc?: ShapeDrawFunc
}
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
