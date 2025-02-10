---
layout: doc
footer: false
---

# How to Use Action

- [`selection action`](/en/api/action/selection) is used in conjunction with the [`selection plugin`](/en/api/plugin/selection) . When the `selection plugin` is used, all shapes will automatically have `selection action` added by the selection plugin.

- [`lmb-move action`](/en/api/action/lmb-move) allows you to drag shapes with the mouse after it is used.

## Example

### Class Method

```ts
import { Shape, LmbMoveAction } from 'mark-img'
Shape.useAction(LmbMoveAction, {
	// action options
})
```

### Instance Method

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
