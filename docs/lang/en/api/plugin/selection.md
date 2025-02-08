---
layout: doc
footer: false
---

# Selection Plugin

Selection plugin, used in conjunction with the selection action. When used individually, the plugin registers the selection action for each shape.

## Static Properties

### pluginName

`selection`

## Instance Properties

### selectShapeList

List of selected shapes

## Instance Methods

### mode

```ts
export type SelectionType = 'single' | 'multiple'
```

params: `(newMode?: SelectionType)`

Switch between single and multiple selection modes

### getSelectionAction

params: `(shape: ImageMarkShape)`
return: `SelectionAction | undefined`

Get the selection action for a specific shape

### selectShape

params: `(shape: ImageMarkShape)`

Select a specific shape

### selectShapes

params: `(shapeList: ImageMarkShape[])`

Select multiple shapes

### unselectShape

params: `(shape: ImageMarkShape)`

Unselect a specific shape

### unselectShapes

params: `(shapeList: ImageMarkShape[])`

Unselect multiple shapes

### clear

Clear all selections

### destroy

Destroy the plugin
