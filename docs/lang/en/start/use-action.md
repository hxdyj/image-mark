---
layout: doc
footer: false
---

# How to Use Action

Actions are behaviors attached to Shapes that control interaction. For example: highlight on selection, drag shapes with mouse, etc.

## Built-in Actions

| Action | Function | API |
|--------|----------|-----|
| [SelectionAction](/en/api/action/selection) | Show selection box on select | [Details](/en/api/action/selection) |
| [LmbMoveAction](/en/api/action/lmb-move) | Drag shape with left mouse button | [Details](/en/api/action/lmb-move) |

- `SelectionAction` is auto-added by [Selection Plugin](/en/api/plugin/selection), no manual management needed
- `LmbMoveAction` is enabled by default, can be removed via `unuseDefaultAction`

## Usage

### Class Method (Global)

```ts
import { ImageMarkShape, LmbMoveAction } from 'mark-img'

// All shapes will have this Action
ImageMarkShape.useAction(LmbMoveAction, {
	// action options
})
```

### Instance Method (Per Shape)

```ts
import ImageMark, { ShapePlugin, LmbMoveAction, ImageMarkRect } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance)
	shapePluginInstance.addShape(ImageMarkRect, {
		afterRender(shapeInstance) {
			shapeInstance.addAction(LmbMoveAction, {
				// action options
			})
		},
	})
})
```

## Disabling Actions

```ts
const shapePlugin = imgMark.getShapePlugin()

// Disable specific action
shapePlugin?.disableAction('lmb-move')

// Re-enable
shapePlugin?.enableAction('lmb-move')
```

## Removing Default Actions

```ts
import { ImageMarkShape, LmbMoveAction } from 'mark-img'

// Remove all default Actions
ImageMarkShape.unuseDefaultAction()

// Remove specific Action
ImageMarkShape.unuseAction(LmbMoveAction)
```

For more, see [Action Class API](/en/api/action-class).

