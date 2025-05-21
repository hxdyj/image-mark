---
layout: doc
footer: false
---

# Shape 类

Shape 类是所有形状的基类，它提供了一些基本的属性和方法。可以继承此类来实现自己的形状。

## 类名

`ImageMarkShape`

::: danger 注意

类名不是 Shape，而是 ImageMarkShape，这是因为 Shape 在 `Svg.js` 里有同名的类

:::

## 构造函数

### constructor

```ts
export type ShapeDrawFunc = (shape: ImageMarkShape) => void

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr // 自定义 shape 的属性
	afterRender?: (shapeInstance: ImageMarkShape) => void // 绘制完成后添加到画布后调用，也就是dom已经渲染完成
	initDrawFunc?: ShapeDrawFunc // 初始自定义绘制函数
}
```

参数：(

- public data: T, `形状的数据，可以是任意类型，具体的类型由子类实现`
- imageMarkInstance: ImageMark, `形状所属的 ImageMark 实例`
- public options: ShapeOptions `形状的选项，具体的选项由子类实现`

)

Shape 类的构造函数

## 静态属性

### shapeName

shape 的名称

### actionList

shape 的动作列表

## 静态方法

### useAction

参数：`(action: typeof Action, actionOptions: any = {})`

使用指定的动作

### unuseAction

参数：`(action: typeof Action)`

取消使用指定的动作

### hasAction

参数：`(action: typeof Action)`

判断是否有指定的动作

### useDefaultAction

使用默认的动作

### unuseDefaultAction

取消使用默认的动作

## 抽象方法

### draw

刻画形状

## 实例属性

### mouseDrawType

`readonly`

```ts
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'
```

鼠标绘制类型，oneTouch:一笔绘制，multiPress:多次点击绘制

### uid

形状的唯一标识符

### shapeInstance

形状的 `Svg.js` `G` 实例

### isRendered

是否已经渲染过

### isBindActions

是否已经绑定动作

### imageMark

形状所属的 `ImageMark` 实例

### action

```ts
action:{
	[key: string]: Action
}
```

形状的动作

## 实例方法

### addDrawFunc

参数：`(func: ShapeDrawFunc)`

添加绘制函数，用于自定义绘制，在每次`draw`时都会调用，比如自定义 fillColor，strokeWidth 等,或者 select fillColor 等等

### removeDrawFunc

参数：`(func: ShapeDrawFunc)`

移除绘制函数

### getMainShape

获取主形状

### getMainId

获取主形状的 id

### updateData

参数：`(data: T)`

更新形状的数据

### getMouseMoveThreshold

获取鼠标移动绘制形状时候的阈值，默认为 0

### setMouseMoveThreshold

参数：`(threshold: number)`

设置鼠标移动绘制形状时候的阈值

### destroy

销毁形状并从画布中移除

### render

```ts
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]
```

参数：`(stage: AddToShape)`

渲染形状到画布上，如果已经渲染过，则不再渲染

### addAction

参数：`(action: typeof Action, actionOptions: any = {})`

添加实例动作

### removeAction

参数：`(action: typeof Action)`

移除实例动作

### initAction

初始化实例动作，如果已经绑定动作，则不再绑定
