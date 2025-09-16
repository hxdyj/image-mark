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
	label?: string
	[x: string]: any
}

export type ShapeAttr =
	| {
			stroke?: StrokeData
			fill?: string
			//auxiliary line
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
			dot?: {
				//dot shape radius
				r?: number
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

```ts
// Use Shape
useShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): ShapePlugin<T>
```

### unuseShape

```ts
// Unuse Shape
unuseShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): ShapePlugin<T>
```

### hasShape

```ts
// Check if a Shape is being used
hasShape<T extends ShapeData>(shape: typeof ImageMarkShape<T>): boolean
```

### useDefaultShape

```ts
// Use all built-in Shapes
useDefaultShape(): void
```

### unuseDefaultShape

```ts
// Unuse all built-in Shapes
unuseDefaultShape(): void
```

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

### setData

```ts
// Set shape plugin data
setData(data: T[]): void
```

### removeNode

```ts
// Remove a specific shape
removeNode(data: T): void
```

### removeAllNodes

```ts
// Remove all shapes
removeAllNodes(emit = true): void
```

### getShapeOptions

```ts
// Get shape options
getShapeOptions(shapeOptions?: ShapeOptions): ShapeOptions
```

### redrawNodes

```ts
// Redraw all shapes
redrawNodes(): void
```

### disableAction

```ts
// Disable action
disableAction(action: string | string[]): void
```

### enableAction

```ts
// Enable action
enableAction(action: string | string[]): void
```

### destroy

```ts
// Destroy plugin instance
destroy(): void
```

### onAdd

```ts
// Add shape
onAdd(data: T, emit = true): void
```

### clear

```ts
// Clear all shapes
clear(): void
```

### getInstanceByData

```ts
// Get shape instance by data
getInstanceByData(data: T): ImageMarkShape | undefined
```

### addShape

```ts
// Add shape to instance
addShape(shape: typeof ImageMarkShape<T>, shapeOptions?: ShapeOptions): ShapePlugin<T>
```

### removeShape

```ts
// Remove shape from instance
removeShape(shape: typeof ImageMarkShape<T>): ShapePlugin<T>
```

### startDrawing

```ts
// Start drawing shape
startDrawing(shape: ImageMarkShape<T>, programmaticDrawing = false): ShapePlugin<T>
```

### drawing

```ts
// Continue drawing the shape that is being drawn
drawing(shapeData: T): ShapePlugin<T>
```

### endDrawing

```ts
// Finish drawing, add to `data` if not cancelled
endDrawing(cancel = false): ShapePlugin<T>
```

### dropLastMouseTrace

```ts
// Remove the last mouse event from the trace, used for undoing in the drawing process
dropLastMouseTrace(): void
```

### addAction

```ts
// Add instance action
addAction(action: typeof Action, actionOptions: any = {}): void
```

### removeAction

```ts
// Remove instance action
removeAction(action: typeof Action): void
```
