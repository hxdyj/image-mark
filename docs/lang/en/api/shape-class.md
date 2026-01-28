---
layout: doc
footer: false
---

# Shape Class

The Shape class is the base class for all shapes, providing some basic properties and methods. You can inherit this class to implement your own shapes.

## Class Name

`ImageMarkShape`

::: danger Note

The class name is not Shape, but ImageMarkShape. This is because there is a class named Shape in `Svg.js`.

:::

## Types

```ts
export interface ShapeData {
	uuid?: string // Note: All shapes must have a uuid, used for unique identification, if not passed, will be automatically generated
	shapeName: string
	label?: string
	[x: string]: any
}

export type ShapeAttr =
	| {
			stroke?: StrokeData // Default value { width:10, color:'#FF7D00'}
			fill?: string
			auxiliary?: {
				// Configuration for auxiliary lines, such as polygon auxiliary lines
				stroke?: StrokeData // Default value { dasharray: '20,20'}
			}
			label?: {
				// Label-related configuration
				font?: {
					fill?: string
					size?: number // Default value 14
				}
				fill?: string
			}
			dot?: {
				r?: number // Radius of the dot
			}
			image?: {
				opacity?: number // Image opacity, default value 1
				preserveAspectRatio?: 'xMidYMid' | 'none' // Whether the image maintains its aspect ratio, default value xMidYMid
			}
	  }
	| undefined

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr // Custom shape attributes
	afterRender?: (shapeInstance: ImageMarkShape) => void // Called after rendering is complete and added to the canvas, i.e., when the DOM has been rendered
	initDrawFunc?: ShapeDrawFunc // Custom initial drawing function
	enableEdit?: (shapeInstance: ImageMarkShape) => Boolean // Whether to allow editing, returns false to prevent entering edit mode
	enableEditAddMidPoint?: (shapeInstance: ImageMarkShape) => Boolean // Whether to enable adding midpoints during editing, only polyline and polygon need to add midpoints. If null or undefined, it is allowed
}

// Mouse drawing type, oneTouch: draw with one stroke, multiPress: draw with multiple clicks
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'
// Drawing type, point: draw all passing points, centerR: draw with the start point as the center and the distance between start and end points as radius r, centerRxy: draw with the start point as the center, the difference between x1 and x2 as Rx, and the difference between y1 and y2 as Ry
export type ShapeDrawType = 'point' | 'centerR' | 'centerRxy'
export type ShapeDrawFunc = (shape: ImageMarkShape) => void
```

## Constructor

### constructor

```ts
constructor(
	public data: T, //The data of the shape, can be any type, the specific type is implemented by subclasses
	imageMarkInstance: ImageMark, //The ImageMark instance to which the shape belongs
	public options: ShapeOptions //The options of the shape, the specific options are implemented by subclasses
): ImageMarkShape<T extends ShapeData = ShapeData>

```

## Static Properties

### shapeName

The name of the shape

### actionList

The action list of the shape

## Static Methods

### useAction

```ts
// Use the specified action
useAction(action: typeof Action, actionOptions: any = {}): void
```

### unuseAction

```ts
// Cancel the use of the specified action
unuseAction(action: typeof Action): void
```

### hasAction

```ts
// Determine if there is the specified action
hasAction(action: typeof Action): boolean
```

### useDefaultAction

```ts
// Use the default action
useDefaultAction(): void
```

### unuseDefaultAction

```ts
// Cancel the use of the default action
unuseDefaultAction(): void
```

## Abstract Methods

### draw

```ts
// Draw the shape
draw(): void
```

### translate

```typescript
// Move the shape
translate(x: number, y: number): void
```

### drawEdit

```ts
// Draw edit group
drawEdit(): void
```

### fixData

```ts
// Fix data, when restricted, fix abnormal data such as out-of-bounds or negative values
fixData(data?: T): void
```

## Instance Properties

### mouseDrawType

Type: ShapeMouseDrawType

Mouse drawing type, oneTouch: draw with one stroke, multiPress: draw with multiple clicks

### drawType

Drawing type, type: ShapeDrawType

- point: Draw all passing points
- centerR: Draw with the start point as the center and the distance between start and end points as radius r
- centerRxy: Draw with the start point as the center, the difference between x1 and x2 as Rx, and the difference between y1 and y2 as Ry

### uid

The unique identifier of the shape

### shapeInstance

The `Svg.js` `G` instance of the shape

### isRendered

Whether it has been rendered

### isBindActions

Whether actions have been bound

### imageMark

The `ImageMark` instance to which the shape belongs

### action

```ts
action:{
	[key: string]: Action
}
```

The actions of the shape

### editMouseDownEvent

Type: `MouseEvent | null `

Mouse down event during editing

### editOriginData

Type: `T|null`

Original Shape data during editing

### dataSnapshot

Type: `T|null`

Data snapshot, when the `startModifyData` method is called, the current data will be saved to dataSnapshot

## Instance Methods

### getOptions

```ts
// Get merged configuration
getOptions(options?: ShapeOptions): ShapeOptions
```

### addDrawFunc

```ts
// Add a drawing function, used for custom drawing, called every time `draw` is called, such as customizing fillColor, strokeWidth, etc., or selecting fillColor, etc.
addDrawFunc(func: ShapeDrawFunc): void
```

### removeDrawFunc

```ts
// Remove the drawing function
removeDrawFunc(func: ShapeDrawFunc): void
```

### getEditGroup

```ts
// Get edit group
getEditGroup<T = G>(): T

```

### getLabelShape

```ts
// Get the label shape
getLabelShape<T = Shape>(): T
```

### getMainShape

```ts
// Get the main shape
getMainShape<T = Shape>(): T
```

### getEditGroupId

```ts
// Get the id of the edit group
getEditGroupId(): string
```

### getLabelId

```ts
// Get the id of the label shape
getLabelId(): string
```

### getMainId

```ts
// Get the id of the main shape
getMainId(): string
```

### updateData

```ts
// Update the data of the shape
updateData(data: T, emit = true): G
```

### getPreStatusOperateActionName

```ts
// Get the operation action configuration name of the previous status
getPreStatusOperateActionName(): keyof ImageMarkOptions['action'] | null
```

### getMouseMoveThreshold

```ts
// Get the threshold for mouse movement when drawing the shape, the default is 0
getMouseMoveThreshold(): number
```

### setMouseMoveThreshold

```ts
// Set the threshold for mouse movement when drawing the shape
setMouseMoveThreshold(threshold: number)
```

### startEditShape

```ts
// Internally start editing the Shape, do common processing, assign values to editMouseDownEvent and editOriginData, etc.
startEditShape(event: Event): void
```

### endEditShape

```ts
// Internally end editing the Shape, do common processing, clear temporary data
endEditShape(): void
```

### startModifyData

```ts
// Start editing, will save the current data to dataSnapshot
startModifyData(): void
```

### removeEdit

Remove the edited svg Group element

### edit

```ts
// Whether to start editing the shape
edit(on?: boolean, needDraw = true): boolean
```

### isEnableEditAddMidPoint

```ts
// Determine whether adding midpoints is allowed in edit mode (only supported by polyline and polygon)
// If options.enableEditAddMidPoint is null or undefined, returns true
isEnableEditAddMidPoint(): boolean
```

### onReadonlyChange

```ts
// Called when the readonly state changes
onReadonlyChange(readonly: boolean): void
```

### getMainShapeInfo

```ts
// Get the information of the main shape
getMainShapeInfo(): {
	strokeWidth: number
	strokeColor: string
	optimalStrokeColor: string // Optimal font color calculated based on strokeColor
}
```

### destroy

```ts
// Destroy the shape and remove it from the canvas
destroy(): void
```

### render

```ts
// Render the shape to the canvas, if it has already been rendered, it will not be rendered again
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0] // The parameter of Svg.js's Shape addTo method
render(stage: AddToShape): void
```

### addAction

```typescript
// Add an instance action
addAction(action: typeof Action, actionOptions: any = {}): void
```

### removeAction

```typescript
// Remove an instance action
removeAction(action: typeof Action): void
```

### initAction

```typescript
// Initialize instance actions, if actions have already been bound, they will not be bound again
initAction(action: typeof Action, actionOptions: any = null): void
```
