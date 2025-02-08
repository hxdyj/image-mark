---
layout: doc
footer: false
---

# 更改 selection 插件选中时候颜色

## 示例

### class 方式

```ts
import { Shape, SelectionAction } from 'mark-img'

Shape.useAction(SelectionAction, {
	// action options
	initDrawFunc(selection: SelectionAction) {
		const shape = selection.getSelectionShape()
		shape?.stroke({
			color: '#165DFF',
		})
	},
})
```

### 实例方式

```ts
import ImageMark, {
	ShapePlugin,
	SelectionAction,
	ImageMarkRect,
} from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance)
	shapePluginInstance.addShape(ImageMarkRect, {
		// shape options
		afterRender(shapeInstance) {
			shapeInstance.addAction(SelectionAction, {
				// action options
				initDrawFunc(selection: SelectionAction) {
					const shape = selection.getSelectionShape()
					shape?.stroke({
						color: '#165DFF',
					})
				},
			})
		},
	})
})
```
