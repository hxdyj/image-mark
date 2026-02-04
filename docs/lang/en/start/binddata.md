---
layout: doc
footer: false
---

# Shape Data Management

After learning to draw shapes, the next step is managing shape data — modifying labels, categories, deleting, and batch operations.

## Modifying Shape Labels

Use `startModifyData()` and `updateData()` to modify shape data:

```ts
// Get shape instance
const shapePlugin = imgMark.getShapePlugin()
const shapeInstance = shapePlugin?.getInstanceByData(shapeData)

// Start modification (saves snapshot for undo)
shapeInstance?.startModifyData()

// Modify label
const data = shapeInstance?.data
data.label = 'New Label'

// Submit changes
shapeInstance?.updateData(data)
```

::: tip
Calling `startModifyData()` saves a data snapshot, enabling undo with the [History Plugin](/en/api/plugin/history).
:::

## Custom Fields

mark-img's shape data supports any custom fields. For example, if your business needs category functionality, you can add a `category_id` field:

```ts
// Specify category when drawing
imgMark.getShapePlugin()?.startDrawing(new ImageMarkRect({
	shapeName: 'rect',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	category_id: 'car',  // custom field
}, imgMark))

// Modify custom field of existing shape
shapeInstance?.startModifyData()
const data = shapeInstance?.data
data.category_id = 'truck'
shapeInstance?.updateData(data)
```

::: tip
mark-img does not process business logic for custom fields — they simply pass through data serialization. Category management, color mapping, etc. are entirely controlled by your application layer.
:::

## Deleting Shapes

```ts
const shapePlugin = imgMark.getShapePlugin()

// Delete single shape (by instance)
shapePlugin?.removeNode(shapeInstance)

// Delete single shape (by data)
shapePlugin?.removeNode(shapeData)

// Batch delete
shapePlugin?.removeNodes(shapeInstances)

// Delete all shapes
shapePlugin?.removeAllNodes()
```

## Getting Shape Instance from Data

```ts
const shapePlugin = imgMark.getShapePlugin()

// Get shape instance by data
const shapeInstance = shapePlugin?.getInstanceByData(shapeData)
```

## Listening to Data Changes

Listen to shape data changes via events. Full event list at [Events API](/en/api/constructor-on).

```ts
const imgMark = new ImageMark({ /* ... */ })
	// Shape added
	.on('shape_add', (data, shapeInstance) => {
		console.log('Shape added', data)
	})
	// Shape data updated
	.on('shape_update_data', (newData, oldData) => {
		console.log('Data changed', oldData, '->', newData)
	})
	// Shape deleted
	.on('shape_delete', (shapeInstance) => {
		console.log('Shape deleted', shapeInstance.data)
	})
	// Batch delete
	.on('shape_delete_patch', (shapeInstances) => {
		console.log('Batch deleted', shapeInstances.length, 'shapes')
	})
	// Any data change (add/delete/modify)
	.on('shape_plugin_data_change', (data) => {
		console.log('Current data', data)
	})
```

## Replacing All Data

```ts
imgMark.getShapePlugin()?.setData([
	{ shapeName: 'rect', x: 100, y: 100, width: 200, height: 150, label: 'Target A' },
	{ shapeName: 'circle', x: 300, y: 200, r: 80, label: 'Target B' },
])
```

For more methods, see [Shape Plugin API](/en/api/plugin/shape) and [Shape Class API](/en/api/shape-class).

