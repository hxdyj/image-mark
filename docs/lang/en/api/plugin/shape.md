---
layout: doc
footer: false
---

# Shape Plugin

This plugin is the most basic plugin, primarily used for managing `Shape` data and instances, as well as registering `Shape` actions and recording mouse events during mouse drawing to facilitate the `Shape` instance drawing based on mouse-drawn path data.

## Types

```typescript
export interface ShapeData {
	shapeName: string
	transform?: ShapeTransform
	label?: string
	[x: string]: any
}

export type ShapeAttr =
	| {
			stroke?: StrokeData
			fill?: string
			//辅助线
			auxiliary?: {
				stroke?: StrokeData
			}
			label?: {
				font?: {
					fill?: string
					size?: number
				}
				fill?: string
			}
	  }
	| undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr // Customize the properties of shape
	afterRender?: (shapeInstance: ImageMarkShape) => void
	initDrawFunc?: ShapeDrawFunc
}
```

## Options

```ts
export type ShapePluginOptions<T extends ShapeData = ShapeData> = {
	shapeList: T[]
	shapeOptions?: ShapeOptions
}
```

When registering the `shape plugin` on an `ImageMark` instance, you can pass in a `shapeList` array to initialize the plugin instance. This plugin can use multiple built-in `Shape` types, or you can use `custom Shape` types via the `useShape` method.

## Using Shape Example

### class Method

```ts
import { ShapePlugin, ImageMarkRect } from 'mark-img'
ShapePlugin.useShape(ImageMarkRect, {
	// shape options
})
```

### Instance Method

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				// shape options
			},
		},
	},
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance, {
		// shape options
	})
	shapePluginInstance.addShape(ImageMarkRect, {
		// shape options
	})
})
```

## Static Properties

### pluginName

`shape`

### shapeList

Array of `shape` on the class

## Static Methods

### useShape

params: (

- shape: `typeof ImageMarkShape<T>`,
- shapeOptions?: ShapeOptions

)

Use Shape

### unuseShape

params: `(shape: typeof ImageMarkShape<T>)`

Unuse Shape

### hasShape

params: `(shape: typeof ImageMarkShape<T>)`

Check if a Shape is being used

### useDefaultShape

Use all built-in Shapes

### unuseDefaultShape

Unuse all built-in Shapes

## Instance Properties

### data

Array type, stores all shape data

### disableActionList

Set type, stores all disabled actions

### shape

```ts
shape: {
	[key: string]: {
		ShapeClass: ImageMarkShape,
		shapeOptions?: ShapeOptions
	}
}
```

Stores the Shape class and Shape options used by the current plugin instance

### drawingShape

The Shape instance currently being drawn (e.g., by mouse)

### programmaticDrawing

Whether the drawing is being done programmatically

### drawingMouseTrace

Type: `Array<MouseEvent>`

Records mouse events during the drawing process

## Instance Methods

### getLabelShape

Get the Label shape instance

### getLabelId

Get the id of the Label shape

### setData

params: `(data: T[])`

Set shape plugin data

### removeNode

params: `(data: T)`

Remove a specific shape

### removeAllNodes

params: `(emit = true)`

Remove all shapes

### getShapeOptions

params: `(shapeOptions?: ShapeOptions)`

Get shape options

### redrawNodes

Redraw all shapes

### disableAction

params: `(action: string | string[])`

Disable action

### enableAction

params: `(action: string | string[])`

Enable action

### destroy

Destroy plugin instance

### onAdd

params: `(data: T, emit = true)`

Add shape

### onDelete

params: `(data: T, shapeInstance: ImageMarkShape)`

Delete shape

### clear

Clear all shapes

### getInstanceByData

params: `(data: T)`

Get shape instance by data

### addShape

params: (

- shape: `typeof ImageMarkShape<T>`,
- shapeOptions?: ShapeOptions

)

Add shape to instance

### removeShape

Remove shape from instance

### startDrawing

params: `(shape: ImageMarkShape<T>, programmaticDrawing = false)`

Start drawing shape

### drawing

params: `(shapeData: T)`

Continue drawing the shape that is being drawn

### endDrawing

params: `(cancel = false)`

Finish drawing, add to `data` if not cancelled

### dropLastMouseTrace

Remove the last mouse event from the trace, used for undoing in the drawing process
