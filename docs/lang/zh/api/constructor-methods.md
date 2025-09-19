---
layout: doc
footer: false
---

## 静态方法

### usePlugin

```ts
// 使用插件
usePlugin(plugin: typeof Plugin): ImageMark
```

### unusePlugin

```ts
// 取消使用插件
unusePlugin(plugin: typeof Plugin): ImageMark
```

### hasPlugin

```ts
// 检查是否使用了插件
hasPlugin(plugin: typeof Plugin): boolean
```

### useDefaultPlugin

使用默认插件，包含内置的 [`shape`](/api/plugin/shape) 和 [`selection`](/api/plugin/selection) 插件

```ts
useDefaultPlugin(): void
```

### unuseDefaultPlugin

```ts
// 取消使用默认插件
unuseDefaultPlugin(): void
```

## 实例方法

### resize

```ts
// 容器大小改变时触发
resize(): void
```

### rerender

```ts
// 重新渲染时触发
rerender(): void
```

### destroy

```ts
// 销毁实例
destroy(): void
```

### addDefaultAction

```ts
// 添加实例默认动作，目前默认有画布缩放和移动两个动作
addDefaultAction(): ImageMark
```

### removeDefaultAction

```ts
// 移除实例默认动作
removeDefaultAction(): ImageMark
```

### addStageLmbDownMoveing

```ts
// 添加画布移动
addStageLmbDownMoveing(): ImageMark
```

### removeStageLmbDownMoveing

```ts
// 移除画布移动
removeStageLmbDownMoveing(): ImageMark
```

### addStageMouseScale

```ts
// 添加画布缩放
addStageMouseScale(): ImageMark
```

### removeStageMouseScale

```ts
// 移除画布缩放
removeStageMouseScale(): ImageMark
```

### moveTo

```ts
export type Position =
	| 'left-top'
	| 'right-top'
	| 'left-bottom'
	| 'right-bottom'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'center'

// 移动到指定位置
moveTo(position: Position): ImageMark
```

### move

```ts
export type ArrayPoint = [number, number]

// 移动到指定坐标
move(point: ArrayPoint): ImageMark
```

### startSuccessiveMove

```ts
// 开始连续移动
startSuccessiveMove(point: ArrayPoint): ImageMark
```

### moveSuccessive

```ts
// 连续移动
moveSuccessive(point: ArrayPoint): ImageMark
```

### endSuccessiveMove

```ts
// 停止连续移动
endSuccessiveMove(): ImageMark
```

### scale

```ts
// 缩放画布
scale(
  direction: 1 | -1, // 1 放大，-1 缩小
  point: ArrayPoint | 'left-top' | 'center', // 缩放点
  reletiveTo: 'container' | 'image' = 'container', // 相对于谁来缩放
  newScale?: number // 新的缩放比例，有此值直接按照这个比例缩放
): ImageMark
```

### scaleTo

```ts
// 缩放到指定比例
scaleTo(
  options: [ImageMarkOptions['initScaleConfig']](/api/constructor-options#initscaleconfig),
  point: ArrayPoint | 'left-top' | 'center', // 缩放点
  reletiveTo: 'container' | 'image' = 'container' // 相对于谁来缩放
): ImageMark
```

### setMinScale

```ts
export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'

// 设置最小缩放比例
setMinScale(minScale: number|InitialScaleSize): ImageMark
```

### setMaxScale

```ts
// 设置最大缩放比例
setMaxScale(maxScale: number|InitialScaleSize): ImageMark
```

### getCurrentScale

```ts
// 获取当前缩放比例
getCurrentScale(): number
```

### on

绑定实例事件，目前实例可监听的事件参考文档 [事件](/api/constructor-on)

```ts
on(...rest: any): void // 参考 eventemitter3 的 on 方法
```

### off

```ts
// 取消绑定实例事件
off(...rest: any): void // 参考 eventemitter3 的 off 方法
```

### setImageFullOfContainer

```ts
// 设置图片覆盖容器
setImageFullOfContainer(enable: boolean): ImageMark
```

### setEnableDrawShapeOutOfImg

```ts
// 设置绘制是否能超出图片
setEnableDrawShapeOutOfImg(enable: boolean): ImageMark
```

### setEnableMoveShapeOutOfImg

```ts
// 设置移动是否能超出图片
setEnableMoveShapeOutOfImg(enable: boolean): ImageMark
```

### setEnableShapeOutOfImg

```ts
// 设置形状是否能超出图片，包含所有的动作，比如移动和绘制
setEnableShapeOutOfImg(enable: boolean): ImageMark
```

### initPlugin

```ts
export type PluginNewCall = (imageMarkInstance: ImageMark) => Plugin

// 实例化插件
initPlugin(plugin: typeof Plugin|PluginNewCall): ImageMark
```

### addPlugin

```ts
// 添加实例上的插件,目前和 `initPlugin` 效果一致
addPlugin(plugin: typeof Plugin|PluginNewCall): ImageMark
```

### removePlugin

```ts
// 移除实例上的插件
removePlugin(plugin: typeof Plugin): ImageMark
```

### getShapePlugin

```ts
// 获取实例上的 `shape` 插件实例
getShapePlugin(): ShapePlugin | null
```

### getSelectionPlugin

```ts
// 获取实例上的 `selection` 插件实例
getSelectionPlugin(): SelectionPlugin | null
```
