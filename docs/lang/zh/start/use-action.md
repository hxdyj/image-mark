---
layout: doc
footer: false
---

# 如何使用 Action

- [`selection action`](/api/action/selection) 是 [`selection plugin`](/api/plugin/selection) 配套使用的，在使用`selection plugin`的时候，所有`shape`会被`selection plugin`自动添加上`selection action`。
- [`lmb-move action`](/api/action/lmb-move)使用后可以用鼠标来拖动 shape

## 示例

### class 方式

```ts
import { Shape, LmbMoveAction } from 'mark-img'
Shape.useAction(LmbMoveAction, {
	// action options
})
```

### 实例方式

```ts
import ImageMark, { ShapePlugin, LmbMoveAction, ImageMarkRect } from 'mark-img'
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance)
	shapePluginInstance.addShape(ImageMarkRect, {
		// shape options
		afterRender(shapeInstance) {
			shapeInstance.addAction(LmbMoveAction, {
				// action options
			})
		},
	})
})
```
