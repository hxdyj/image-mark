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

## Types

```ts
export interface ShapeData {
	uuid?: string //注意所有的shape都需要有uuid，用于唯一标识, 不传入会自动生成
	shapeName: string
	label?: string
	[x: string]: any
}

export type ShapeAttr =
	| {
			stroke?: StrokeData // 默认值 { width:10, color:'#FF7D00'}
			fill?: string
			auxiliary?: {
				// 辅助线的配置，比如polygon的辅助线
				stroke?: StrokeData // 默认值 { dasharray: '20,20'}
			}
			label?: {
				//标签相关配置
				font?: {
					fill?: string
					size?: number // 默认值 14
				}
				fill?: string
			}
			dot?: {
				r?: number //点的半径
			}
			image?: {
				opacity?: number //图片透明度 默认值 1
				preserveAspectRatio?: 'xMidYMid' | 'none' //图片是否保持比例 默认值 xMidYMid
			}
	  }
	| undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr //自定义 shape 的属性
	afterRender?: (shapeInstance: ImageMarkShape) => void // 绘制完成后添加画布后调用，也就是 dom 已经渲染完成
	initDrawFunc?: ShapeDrawFunc // 自定义初始绘制函数
}

//鼠标绘制类型，oneTouch:一笔绘制，multiPress:多次点击绘制
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'
//绘制类型，point:所有划过的点绘制，centerR:起点为中心点，起止点距离为半径r绘制，centerRxy:起点为中心点，起止点x1，x2差值为Rx,y1,y2差值为Ry绘制
export type ShapeDrawType = 'point' | 'centerR' | 'centerRxy'
export type ShapeDrawFunc = (shape: ImageMarkShape) => void
```

## 构造函数

### constructor

```ts
constructor(
	public data: T, //形状的数据，可以是任意类型，具体的类型由子类实现
	imageMarkInstance: ImageMark, //形状所属的 ImageMark 实例
	public options: ShapeOptions //形状的选项，具体的选项由子类实现
): ImageMarkShape<T extends ShapeData = ShapeData>

```

## 静态属性

### shapeName

shape 的名称

### actionList

shape 的动作列表

## 静态方法

### useAction

```ts
//使用指定的动作
useAction(action: typeof Action, actionOptions: any = {}): void
```

### unuseAction

```ts
//取消使用指定的动作
unuseAction(action: typeof Action): void
```

### hasAction

```ts
//判断是否有指定的动作
hasAction(action: typeof Action): boolean
```

### useDefaultAction

```ts
//使用默认的动作
useDefaultAction(): void
```

### unuseDefaultAction

```ts
//取消使用默认的动作
unuseDefaultAction(): void
```

## 抽象方法

### draw

```ts
//刻画形状
draw(): void
```

### translate

```typescript
// 移动图形
translate(x: number, y: number): void
```

### drawEdit

```ts
//绘制编辑组
drawEdit(): void
```

### fixData

```ts
//修复数据，在限制时候，修复超出或者负数等异常数据
fixData(data?: T): void
```

## 实例属性

### mouseDrawType

类型：ShapeMouseDrawType

鼠标绘制类型，oneTouch:一笔绘制，multiPress:多次点击绘制

### drawType

绘制类型，类型：ShapeDrawType

- point:所有划过的点绘制
- centerR:起点为中心点，起止点距离为半径 r 绘制
- centerRxy:起点为中心点，起止点 x1，x2 差值为 Rx,y1,y2 差值为 Ry 绘制

### uid

形状的唯一标识符

### shapeInstance

形状的 `Svg.js` `G` 实例

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

### editMouseDownEvent

类型：`MouseEvent | null `

编辑时的鼠标按下事件

### editOriginData

类型：`T|null`

编辑时原始的 Shape 数据

### dataSnapshot

类型：`T|null`

数据快照, 当调用`startModifyData`方法时候会将当前数据保存到 dataSnapshot 中

## 实例方法

### isRendered

```ts
//判断形状是否已经渲染到舞台上
isRendered(): boolean
```

### getOptions

```ts
//获取合并后的配置
getOptions(options?: ShapeOptions): ShapeOptions
```

### addDrawFunc

```ts
//添加绘制函数，用于自定义绘制，在每次`draw`时都会调用，比如自定义 fillColor，strokeWidth 等,或者 select fillColor 等等
addDrawFunc(func: ShapeDrawFunc): void
```

### removeDrawFunc

```ts
//移除绘制函数
removeDrawFunc(func: ShapeDrawFunc): void
```

### getEditGroup

```ts
//获取编辑组
getEditGroup<T = G>(): T

```

### getLabelShape

```ts
//获取标签形状
getLabelShape<T = Shape>(): T
```

### getMainShape

```ts
//获取主形状
getMainShape<T = Shape>(): T
```

### getEditGroupId

```ts
//获取编辑组的 id
getEditGroupId(): string
```

### getLabelId

```ts
//获取标签形状的 id
getLabelId(): string
```

### getMainId

```ts
//获取主形状的 id
getMainId(): string
```

### updateData

```ts
//更新形状的数据
updateData(data: T, emit = true): G
```

### getPreStatusOperateActionName

```ts
//获取上一个状态的操作动作配置名称
getPreStatusOperateActionName(): keyof ImageMarkOptions['action'] | null
```

### getMouseMoveThreshold

```ts
//获取鼠标移动绘制形状时候的阈值，默认为 0
getMouseMoveThreshold(): number
```

### setMouseMoveThreshold

```ts
//设置鼠标移动绘制形状时候的阈值
setMouseMoveThreshold(threshold: number)
```

### startEditShape

```ts
//内部开始编辑Shape,做通用的处理，给editMouseDownEvent和editOriginData赋值等
startEditShape(event: Event): void
```

### endEditShape

```ts
//内部结束编辑Shape,做通用的处理，清除临时数据
endEditShape(): void
```

### startModifyData

```ts
//开始编辑，会将当前数据保存到 dataSnapshot 中
startModifyData(): void
```

### removeEdit

移除编辑的 svg Group 元素

### edit

```ts
// 是否开始编辑形状
edit(on?: boolean, needDraw = true): boolean
```

### onReadonlyChange

```ts
//只读状态改变时调用
onReadonlyChange(readonly: boolean): void
```

### getMainShapeInfo

```ts
//获取主形状的信息
getMainShapeInfo(): {
	strokeWidth: number
	strokeColor: string
	optimalStrokeColor: string //根据 strokeColor 计算出的最优的字体颜色
}
```

### destroy

```ts
//销毁形状并从画布中移除
destroy(): void
```

### render

```ts
//渲染形状到画布上，如果已经渲染过，则不再渲染
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0] //Svg.js 的Shape的addTo方法的参数
render(stage: AddToShape): void
```

### addAction

```typescript
//添加实例动作
addAction(action: typeof Action, actionOptions: any = {}): void
```

### removeAction

```typescript
//移除实例动作
removeAction(action: typeof Action): void
```

### initAction

```typescript
//初始化实例动作，如果已经绑定动作，则不再绑定
initAction(action: typeof Action, actionOptions: any = null): void
```
