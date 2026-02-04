---
layout: doc
footer: false
---

# How to Listen Events

mark-img is event-driven. Use the `.on()` method to listen to various events. Full event list at [Events API](/en/api/constructor-on).

## Basic Usage

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: { shapeList: [] },
	},
})
```

Supports chaining:

```ts
imgMark
	.on('shape_add', (data, shapeInstance) => { /* ... */ })
	.on('scale', (scale) => { /* ... */ })
	.on('readonly_change', (readonly) => { /* ... */ })
```

## Common Event Examples

### Shape Lifecycle

```ts
// Shape added (triggered after mouse drawing completes)
imgMark.on('shape_add', (data, shapeInstance) => {
	console.log('Shape added', data.shapeName, data)
})

// Shape data updated
imgMark.on('shape_update_data', (newData, oldData) => {
	console.log('Data changed', oldData, '->', newData)
})

// Shape deleted
imgMark.on('shape_delete', (shapeInstance) => {
	console.log('Shape deleted', shapeInstance.data)
})

// Any data change (add/delete/modify)
imgMark.on('shape_plugin_data_change', (data) => {
	console.log('All data', data)
})
```

### Drawing Process

```ts
// Drawing started
imgMark.on('shape_start_drawing', (shapeInstance) => {
	console.log('Started drawing', shapeInstance.data.shapeName)
})

// Drawing ended (cancel=true means cancelled)
imgMark.on('shape_end_drawing', (cancel, data) => {
	if (cancel) {
		console.log('Drawing cancelled')
	} else {
		console.log('Drawing completed', data)
	}
})
```

### Selection & Interaction

```ts
// Selection list changed
imgMark.on('selection_select_list_change', (list) => {
	console.log('Selected', list.length, 'shapes')
})

// Shape clicked
imgMark.on('shape_click', (evt, shapeInstance) => {
	console.log('Clicked shape', shapeInstance.data)
})

// Shape moved
imgMark.on('shape_start_move', (shapeInstance) => {
	console.log('Move started')
})

imgMark.on('shape_end_move', (shapeInstance, [diffX, diffY]) => {
	console.log('Move ended, offset', diffX, diffY)
})
```

### Context Menu

```ts
// Right-click on shape
imgMark.on('shape_context_menu', (evt, shapeInstance) => {
	evt.preventDefault()
	showContextMenu(evt.clientX, evt.clientY, shapeInstance)
})

// Right-click on container
imgMark.on('container_context_menu', (evt) => {
	evt.preventDefault()
	showContainerMenu(evt.clientX, evt.clientY)
})
```

### View & Status

```ts
// Scale changed
imgMark.on('scale', (scale) => {
	console.log('Scale', (scale * 100).toFixed(0) + '%')
})

// Readonly changed
imgMark.on('readonly_change', (readonly) => {
	console.log('Readonly mode', readonly)
})

// History changed
imgMark.on('history_change', (info) => {
	console.log('Undoable:', info.undo, 'Redoable:', info.redo)
})

// First render complete (good for initialization)
imgMark.on('first_render', () => {
	console.log('Render complete')
})
```

## Removing Listeners

```ts
function onScale(scale) {
	console.log(scale)
}

imgMark.on('scale', onScale)

// Remove listener
imgMark.off('scale', onScale)
```

