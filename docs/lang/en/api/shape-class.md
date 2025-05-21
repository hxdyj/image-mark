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

## Constructor

### constructor

```ts
export type ShapeDrawFunc = (shape: ImageMarkShape) => void

export type ShapeOptions = {
	setAttr?: (shapeInstance: ImageMarkShape) => ShapeAttr // Customize the properties of shape
	afterRender?: (shapeInstance: ImageMarkShape) => void //  Called after the shape is added to the canvas, i.e., the DOM is already rendered
	initDrawFunc?: ShapeDrawFunc // Custom initial drawing function
}
```

params: (

- public data: T, `The data of the shape, can be any type, the specific type is implemented by subclasses`
- imageMarkInstance: ImageMark, `The ImageMark instance to which the shape belongs`
- public options: ShapeOptions `The options of the shape, the specific options are implemented by subclasses`

)

The constructor of the Shape class

## Static Properties

### shapeName

shape The name of the shape

### actionList

The action list of the shape

## Static Methods

### useAction

params: `(action: typeof Action, actionOptions: any = {})`

Use the specified action

### unuseAction

params: `(action: typeof Action)`

Cancel the use of the specified action

### hasAction

params: `(action: typeof Action)`

Determine if there is the specified action

### useDefaultAction

Use the default action

### unuseDefaultAction

Cancel the use of the default action

## Abstract Methods

### draw

Draw the shape

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

params: `(func: ShapeDrawFunc)`

Add a drawing function, used for custom drawing, called every time `draw` is called, such as customizing fillColor, strokeWidth, etc., or selecting fillColor, etc.

### removeDrawFunc

params: `(func: ShapeDrawFunc)`

Remove the drawing function

### getMainShape

Get the main shape

### getMainId

Get the id of the main shape

### updateData

params: `(data: T)`

Update the data of the shape

### getMouseMoveThreshold

Get the threshold for mouse movement when drawing the shape, the default is 0

### setMouseMoveThreshold

params: `(threshold: number)`

Set the threshold for mouse movement when drawing the shape

### destroy

Destroy the shape and remove it from the canvas

### render

```ts
export type AddToShape = Parameters<InstanceType<typeof Shape>['addTo']>[0]
```

params: `(stage: AddToShape)`

Render the shape to the canvas, if it has already been rendered, it will not be rendered again

### addAction

params: `(action: typeof Action, actionOptions: any = {})`

Add an instance action

### removeAction

params: `(action: typeof Action)`

Remove an instance action

### initAction

Initialize instance actions, if actions have already been bound, they will not be bound again
