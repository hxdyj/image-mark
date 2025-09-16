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
export type ShapeDrawFunc = (shape: ImageMarkShape) => void

export type ShapeOptions = {
	// Customize the properties of shape
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr
	// Called after the shape is added to the canvas, i.e., the DOM is already rendered
	afterRender?: (shapeInstance: ImageMarkShape) => void
	// Custom initial drawing function
	initDrawFunc?: ShapeDrawFunc
}
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

## Instance Properties

### mouseDrawType

`readonly`

```ts
export type ShapeMouseDrawType = 'oneTouch' | 'multiPress'
```

The type of mouse drawing, oneTouch: draw with one touch, multiPress: draw with multiple clicks

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

## Instance Methods

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
updateData(data: T): G
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
