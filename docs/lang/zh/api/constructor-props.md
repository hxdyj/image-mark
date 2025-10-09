---
layout: doc
footer: false
---

## 静态属性

### pluginList

当前注册的所有插件列表

## 实例属性

### id

当前实例的唯一标识符

### container

当前实例的容器元素

### containerRectInfo

当前实例的容器元素的矩形信息

### stage

当前实例的舞台对象

### stageGroup

当前实例的舞台对象组

### image

当前实例的 Svg.js 图片对象

### imageDom

当前实例的图片 Dom 元素

### plugin

当前实例的插件对象

### status

```ts
export type ImageMarkStatus = {
	scaling: boolean
	moving: boolean
	shape_drawing: null | ImageMarkShape
	shape_editing: null | ImageMarkShape
	shape_moving: null | ImageMarkShape
}
```

当前实例的状态

### minScale

当前实例的最小缩放比例, 默认`0.01`

### maxScale

当前实例的最大缩放比例，默认`10`

### movingStartPoint

当前实例的画布移动起始点

### eventBus

当前实例的事件总线对象

### globalEventBus

ImageMark 全局事件总线

### createTime

当前实例的创建时间

### movingStartTransform

当前实例的画布移动起始时的变换矩阵
