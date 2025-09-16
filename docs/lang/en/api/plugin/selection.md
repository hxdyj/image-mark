---
layout: doc
footer: false
---

# Selection Plugin

Selection plugin, used in conjunction with the selection action. When used individually, the plugin registers the selection action for each shape.

## Types

```typescript
export type SelectionPluginOptions = {
	selectionActionOptions?: SelectionActionOptions // This property can be passed in pluginOptions['selection'].selectionActionOptions or Selection Plugin instantiation constructor parameters when ImageMark constructs the instance
}

// Selection mode type
export type SelectionType = 'single' | 'multiple'
```

## constructor

```ts
// Create a SelectionPlugin instance
constructor(
	imageMarkInstance: ImageMark,
	public selectionPluginOptions?: SelectionPluginOptions
): SelectionPlugin
```

## Static Properties

### pluginName

`selection`

## Instance Properties

### selectShapeList

List of selected shapes

## Instance Methods

### mode

```ts
// Switch between single and multiple selection modes
mode(newMode?: SelectionType): void
```

### getSelectionAction

```ts
// Get the selection action for a specific shape
getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined
```

### selectShape

```ts
// Select a specific shape
selectShape(shape: ImageMarkShape): void
```

### selectShapes

```ts
// Select multiple shapes
selectShapes(shapeList: ImageMarkShape[]): void
```

### unselectShape

```ts
// Unselect a specific shape
unselectShape(shape: ImageMarkShape): void
```

### unselectShapes

```ts
// Unselect multiple shapes
unselectShapes(shapeList: ImageMarkShape[]): void
```

### clear

```ts
// Clear all selections
clear(): void
```

### destroy

```ts
// Destroy the plugin
destroy(): void
```
