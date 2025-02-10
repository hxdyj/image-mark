---
layout: doc
footer: false
---

# Change the Color When the Selection Plugin is Selected

## Example

### Class Method

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

### Instance Method

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
