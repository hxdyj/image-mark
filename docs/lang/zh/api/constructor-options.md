---
layout: doc
footer: false
---

## 初始化实例

```html
<div id="image-mark"></div>
```

```typescript
import ImageMark from 'mark-img'

const imageMark = new ImageMark({
	// options
	el: ContainerType  // 容器元素或者元素的selector 如 #container
	src: string   // 图片的 URL 地址
	readonly?: boolean, // 是否只读, 默认`false`
	initScaleConfig?: ({  // 初始化图片缩放的配置项
		to?: 'image' // 缩放的目标为image的尺寸
	} | {
		to: 'box' // 缩放的目标为指定的矩形框的尺寸
		box: BoundingBox // 缩放的矩形框的bbox
	}) & {
		startPosition?: StartPosition  //image 或者 box 的起始位置, 默认`center`
		size?: InitialScaleSize //缩放的尺寸, 默认`fit`
		/**
		 * 留白
		 *  */
		padding?: number // 缩放的边距, 默认`0.1`
		paddingUnit?: 'px' | '%' // 边距的单位 默认`%`
	}
	setting?:{
		imageFullOfContainer?: boolean // 是否图片覆盖容器, 默认`false`。如果为true，图片会覆盖整个容器，移动操作这些都不会超出边界，会有图片内容始终覆盖整个容器
	}
	interactive?: {
		move?: boolean // 是否启用拖动画布功能, 默认`true`
		scale?: boolean // 是否启用缩放画布功能, 默认`true`
	}
	action?: {
		enableDrawShapeOutOfImg?: boolean // 是否允许绘制时超出图片, 默认`false`
		enableEditShapeOutOfImg?: boolean // 是否允许编辑时超出图片, 默认`false`
		enableMoveShapeOutOfImg?: boolean // 是否允许移动时超出图片, 默认`false`
	}
	pluginOptions?: {
		[key: string]: any // [插件名称]：[插件配置] 插件的配置项，具体请参考插件文档
	}
})
```

## Types

```typeScript
export type ContainerType = string | HTMLElement;

export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

export type StartPosition = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'

export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'

```
