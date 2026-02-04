---
layout: doc
footer: false
---

# View Control

mark-img provides rich view control capabilities including zoom, pan, readonly mode, and selection mode.

## Zoom

### Mouse Wheel Zoom

Mouse wheel zoom is supported by default, no extra configuration needed.

### Programmatic Zoom

```ts
// Zoom in (+1) / Zoom out (-1)
imgMark.scale(+1, 'center', 'image')
imgMark.scale(-1, 'center', 'image')

// Get current scale
const currentScale = imgMark.getCurrentScale()

// Zoom to specific config
imgMark.scaleTo(imgMark.options.initScaleConfig, 'center', 'image')
```

### Setting Zoom Limits

```ts
// Set minimum scale
imgMark.setMinScale(0.1)

// Set maximum scale
imgMark.setMaxScale(10)

// Use presets: 'fit' | 'original' | 'width' | 'height' | 'cover'
imgMark.setMinScale('fit')
```

### Listening to Scale Events

```ts
imgMark.on('scale', (scale) => {
	console.log('Current scale', (scale * 100).toFixed(0) + '%')
})
```

For more zoom-related API, see [Constructor Methods](/en/api/constructor-methods#scale).

## Panning

### Mouse Drag Panning

Mouse drag panning is supported by default. Hold `Space` during drawing to temporarily switch to pan mode.

### Programmatic Panning

```ts
// Move to preset position
imgMark.moveTo('center')
imgMark.moveTo('left-top')

// Move to specific coordinates
imgMark.move([100, 200])
```

### Reset Position and Scale

```ts
imgMark.scaleTo(imgMark.options.initScaleConfig, 'center', 'image')
imgMark.moveTo('center')
```

## Disabling Interaction

```ts
// Disable/enable panning
imgMark.setInteractiveMove(false)
imgMark.setInteractiveMove(true)

// Disable/enable zooming
imgMark.setInteractiveScale(false)
imgMark.setInteractiveScale(true)
```

## Readonly Mode

In readonly mode, users cannot draw, edit, or move shapes:

```ts
// Enable readonly
imgMark.setReadonly(true)

// Disable readonly
imgMark.setReadonly(false)
```

### Listening to Readonly Changes

```ts
imgMark.on('readonly_change', (readonly) => {
	console.log('Readonly mode', readonly ? 'enabled' : 'disabled')
})
```

## Selection Mode

Control single/multiple selection via [Selection Plugin](/en/api/plugin/selection):

```ts
const selectionPlugin = imgMark.getSelectionPlugin()

// Switch to single select
selectionPlugin?.mode('single')

// Switch to multiple select
selectionPlugin?.mode('multiple')
```

In multiple mode, hold `Ctrl/Command` and click to select multiple shapes.

### Programmatic Selection

```ts
const selectionPlugin = imgMark.getSelectionPlugin()

// Select specific shape
selectionPlugin?.selectShape(shapeInstance)

// Batch select
selectionPlugin?.selectShapes(shapeInstances)

// Deselect
selectionPlugin?.unselectShape(shapeInstance)

// Clear all selections
selectionPlugin?.clear()
```

### Listening to Selection Changes

```ts
imgMark.on('selection_select_list_change', (list) => {
	console.log('Selected', list.length, 'shapes')
})
```

## Drawing Boundary Limits

Control whether shapes can extend beyond image boundaries:

```ts
// Prevent all operations from going outside image (draw, move, edit)
imgMark.setEnableShapeOutOfImg(false)

// Control individually
imgMark.setEnableDrawShapeOutOfImg(false)  // Drawing
imgMark.setEnableMoveShapeOutOfImg(false)  // Moving
imgMark.setEnableEditShapeOutOfImg(false)  // Editing
```

