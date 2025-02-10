---
layout: doc
footer: false
---

## 静态方法

### usePlugin

使用插件

### unusePlugin

取消使用插件

### hasPlugin

检查是否使用了插件

### useDefaultPlugin

使用默认插件，包含内置的 [`shape`](/api/plugin/shape) 和 [`selection`](/api/plugin/selection) 插件

### unuseDefaultPlugin

取消使用默认插件

## 实例方法

### resize

容器大小改变时触发

### rerender

重新渲染时触发

### destroy

销毁实例

### addDefaultAction

添加实例默认动作，目前默认有画布缩放和移动两个动作

### removeDefaultAction

移除实例默认动作

### addStageLmbDownMoveing

添加画布移动

### removeStageLmbDownMoveing

移除画布移动

### addStageMouseScale

添加画布缩放

### removeStageMouseScale

移除画布缩放

### moveTo

参数：(position: Position)

```ts
type Position =
	| 'left-top'
	| 'right-top'
	| 'left-bottom'
	| 'right-bottom'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'center'
```

移动到指定位置

### move

参数：(point: ArrayPoint)

```ts
export type ArrayPoint = [number, number]
```

移动到指定坐标

### startSuccessiveMove

参数：`(point: ArrayPoint)`

开始连续移动

### moveSuccessive

参数：`(point: ArrayPoint)`

连续移动

### endSuccessiveMove()

停止连续移动

### scale

参数：(

- direction: 1 | -1, `1 放大，-1 缩小`
- point: ArrayPoint | 'left-top' | 'center', `缩放点`
- reletiveTo: 'container' | 'image' = 'container', `相对于谁来缩放`
- newScale?: number `新的缩放比例，有此值直接按照这个比例缩放`

  )

### scaleTo

参数：(

- options: [ImageMarkOptions['initScaleConfig']](/api/constructor-options#initscaleconfig),
- point: ArrayPoint | 'left-top' | 'center', `缩放点`
- reletiveTo: 'container' | 'image' = 'container' `相对于谁来缩放`

)

### setMinScale

```ts
export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'
```

参数：`(minScale: number|InitialScaleSize)`

设置最小缩放比例

### setMaxScale

参数：`(minScale: number|InitialScaleSize)`

设置最大缩放比例

### on

参数：(...rest: any) `参考 eventemitter3 的 on 方法`

绑定实例事件，目前实例可监听的事件参考文档 [事件](/api/constructor-on)

### off

参数：(...rest: any) `参考 eventemitter3 的 off 方法`

取消绑定实例事件

### setEnableImageOutOfContainer

参数：`(enable: boolean)`

设置图片是否可以超出容器

### initPlugin

```ts
export type PluginNewCall = (imageMarkInstance: ImageMark) => Plugin
```

参数：`(plugin: typeof Plugin|PluginNewCall)`

实例化插件

### addPlugin

参数：`(plugin: typeof Plugin|PluginNewCall)`

添加实例上的插件,目前和 `initPlugin` 效果一致

### removePlugin

参数：`(plugin: typeof Plugin)`

移除实例上的插件

### getShapePlugin

获取实例上的 `shape` 插件实例

### getSelectionPlugin

获取实例上的 `selection` 插件实例
