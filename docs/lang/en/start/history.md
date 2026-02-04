---
layout: doc
footer: false
---

# Undo & Redo

mark-img includes a built-in [History Plugin](/en/api/plugin/history) that automatically records shape add/delete/modify operations, supporting undo and redo.

## Basic Usage

The History plugin is loaded by default, no manual setup required.

```ts
const historyPlugin = imgMark.getHistoryPlugin()

// Undo
historyPlugin?.undo()

// Redo
historyPlugin?.redo()

// Get stack info
const info = historyPlugin?.getStackInfo()
console.log('Undoable:', info?.undo, 'steps')
console.log('Redoable:', info?.redo, 'steps')

// Clear history
historyPlugin?.clear()
```

## Listening to History Changes

```ts
imgMark.on('history_change', (info) => {
	console.log('Undoable:', info.undo, 'Redoable:', info.redo)
})
```

## Built-in Shortcuts

The [Shortcut Plugin](/en/api/plugin/shortcut) provides default key bindings:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Command + Z` | Undo |
| `Ctrl/Command + Y` | Redo |

## What Gets Recorded

- Adding shapes (mouse drawing, `addNode`)
- Deleting shapes (`removeNode`, `removeNodes`, `removeAllNodes`)
- Modifying shape data (`startModifyData` + `updateData`)

::: tip
Calling `startModifyData()` is key to triggering history recording. Directly modifying `data` without `startModifyData()` won't be recorded in the history stack.
:::

## Complete Example

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
		},
	},
})

// Listen for history changes to update UI button states
imgMark.on('history_change', (info) => {
	document.querySelector('#undo-btn').disabled = info.undo === 0
	document.querySelector('#redo-btn').disabled = info.redo === 0
	document.querySelector('#undo-count').textContent = info.undo
	document.querySelector('#redo-count').textContent = info.redo
})

// Bind buttons
document.querySelector('#undo-btn').onclick = () => {
	imgMark.getHistoryPlugin()?.undo()
}

document.querySelector('#redo-btn').onclick = () => {
	imgMark.getHistoryPlugin()?.redo()
}
```

For more methods, see [History Plugin API](/en/api/plugin/history).

