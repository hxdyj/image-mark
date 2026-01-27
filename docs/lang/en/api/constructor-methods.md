---
layout: doc
footer: false
---

## Types

```ts
export type PluginNewCall = (
	imageMarkInstance: ImageMark,
	pluginOptions?: PluginOptions
) => Plugin
```

## Static Methods

### usePlugin

```ts
// Use a plugin
usePlugin(plugin: typeof Plugin, pluginOptions?: PluginOptions): ImageMark
```

### unusePlugin

```ts
// Unuse a plugin
unusePlugin(plugin: typeof Plugin): ImageMark
```

### hasPlugin

```ts
// Check if a plugin is in use
hasPlugin(plugin: typeof Plugin): boolean
```

### useDefaultPlugin

Use default plugins, which include the built-in [`shape`](/en/api/plugin/shape) and [`selection`](/en/api/plugin/selection) plugins

```ts
useDefaultPlugin(): void
```

### unuseDefaultPlugin

```ts
// Unuse default plugins
unuseDefaultPlugin(): void
```

## Instance Methods

### resize

```ts
// Triggered when the container size changes
resize(): void
```

### rerender

```ts
// Triggered when re-rendering
rerender(): void
```

### destroy

```ts
// Destroy the instance
destroy(): void
```

### addDefaultAction

```ts
// Add default actions to the instance, currently including canvas zooming and moving
addDefaultAction(): ImageMark
```

### removeDefaultAction

```ts
// Remove default actions from the instance
removeDefaultAction(): ImageMark
```

### addStageLmbDownMoveing

```ts
// Add canvas moving
addStageLmbDownMoveing(): ImageMark
```

### removeStageLmbDownMoveing

```ts
// Remove canvas moving
removeStageLmbDownMoveing(): ImageMark
```

### addStageMouseScale

```ts
// Add canvas zooming
addStageMouseScale(): ImageMark
```

### removeStageMouseScale

```ts
// Remove canvas zooming
removeStageMouseScale(): ImageMark
```

### moveTo

```ts
export type Position =
	| 'left-top'
	| 'right-top'
	| 'left-bottom'
	| 'right-bottom'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'center'

// Move to a specified position
moveTo(position: Position): ImageMark
```

### move

```ts
export type ArrayPoint = [number, number]

// Move to specified coordinates
move(point: ArrayPoint): ImageMark
```

### startSuccessiveMove

```ts
// Start successive moving
startSuccessiveMove(point: ArrayPoint): ImageMark
```

### moveSuccessive

```ts
// Successive moving
moveSuccessive(point: ArrayPoint): ImageMark
```

### endSuccessiveMove

```ts
// Stop successive moving
endSuccessiveMove(): ImageMark
```

### scale

```ts
// Scale the canvas
scale(
  direction: 1 | -1, // 1 for zoom-in, -1 for zoom-out
  point: ArrayPoint | 'left-top' | 'center', // zoom-in point
  reletiveTo: 'container' | 'image' = 'container', // relative to whom
  newScale?: number // new scaling ratio, if provided, scale directly to this ratio
): ImageMark
```

### scaleTo

```ts
// Scale to a specific ratio
scaleTo(
  options: ImageMarkOptions['initScaleConfig'],
  point: ArrayPoint | 'left-top' | 'center', // zoom-in point
  reletiveTo: 'container' | 'image' = 'container' // relative to whom
): ImageMark
```

### setMinScale

```ts
export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'

// Set minimum scaling ratio
setMinScale(minScale: number|InitialScaleSize): ImageMark
```

### setMaxScale

```ts
// Set maximum scaling ratio
setMaxScale(maxScale: number|InitialScaleSize): ImageMark
```

### getCurrentScale

```ts
// Get the current scale ratio
getCurrentScale(): number
```

### on

Bind instance events, currently refer to the [events](/en/api/constructor-on) documentation for events that can be listened to by the instance

```ts
on(...rest: any): void // Reference the on method of eventemitter3
```

### off

```ts
// Unbind instance events
off(...rest: any): void // Reference the off method of eventemitter3
```

### setImageFullOfContainer

```ts
// Set whether the image can be full of the container
setImageFullOfContainer(enable: boolean): ImageMark
```

### setEnableDrawShapeOutOfImg

```ts
// Set whether the shape can be out of the image when drawing
setEnableDrawShapeOutOfImg(enable: boolean): ImageMark
```

### setEnableMoveShapeOutOfImg

```ts
// Set whether the shape can be out of the image when moving
setEnableMoveShapeOutOfImg(enable: boolean): ImageMark
```

### setEnableEditShapeOutOfImg

```ts
// Set whether the shape can be out of the image when editing
setEnableEditShapeOutOfImg(enable: boolean): ImageMark
```

### setEnableShapeOutOfImg

```ts
// Set whether the shape can be out of the image, including all actions, such as moving, drawing, and editing
setEnableShapeOutOfImg(enable: boolean): ImageMark
```

### setInteractiveMove

```ts
// Set whether to enable canvas dragging
setInteractiveMove(enable: boolean): ImageMark
```

### setInteractiveScale

```ts
// Set whether to enable canvas scaling
setInteractiveScale(enable: boolean): ImageMark
```

### initPlugin

```ts
// Initialize a plugin
initPlugin(plugin: typeof Plugin|PluginNewCall, pluginOptions?: PluginOptions): ImageMark
```

### addPlugin

```ts
// Add a plugin to the instance, currently has the same effect as `initPlugin`
addPlugin(plugin: typeof Plugin|PluginNewCall, pluginOptions?: PluginOptions): ImageMark
```

### removePlugin

```ts
// Remove a plugin from the instance
removePlugin(plugin: typeof Plugin): ImageMark
```

### getShapePlugin

```ts
// Get the `shape plugin` instance on the instance
getShapePlugin(): ShapePlugin | null
```

### getSelectionPlugin

```ts
// Get the `selection plugin` instance on the instance
getSelectionPlugin(): SelectionPlugin | null
```

### getHistoryPlugin

```ts
// Get the `history plugin` instance on the instance
getHistoryPlugin(): HistoryPlugin | null
```

### getShortcutPlugin

```ts
// Get the `shortcut plugin` instance on the instance
getShortcutPlugin(): ShortcutPlugin | null
```

### setReadonly

```ts
// Set the readonly state of the instance
setReadonly(readonly: boolean): ImageMark
```
