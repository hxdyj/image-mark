---
layout: doc
footer: false
---

# How to Use Plugins

ImageMark's functionality is provided through its plugin system. Beyond core canvas panning and zooming, all features are loaded as plugins on demand.

## Built-in Plugins

| Plugin | Function | API |
|--------|----------|-----|
| [Shape](/en/api/plugin/shape) | Shape management, mouse drawing | [Details](/en/api/plugin/shape) |
| [Selection](/en/api/plugin/selection) | Shape selection (single/multiple) | [Details](/en/api/plugin/selection) |
| [History](/en/api/plugin/history) | Undo/Redo | [Details](/en/api/plugin/history) |
| [Shortcut](/en/api/plugin/shortcut) | Keyboard shortcuts | [Details](/en/api/plugin/shortcut) |
| [Minimap](/en/api/plugin/minimap) | Minimap | [Details](/en/api/plugin/minimap) |

ImageMark auto-loads all built-in plugins by default. To disable, use [`unuseDefaultPlugin`](/en/api/constructor-methods#unusedefaultplugin).

## Usage

### Via Constructor Options (Recommended)

In most cases, pass configuration through `pluginOptions`:

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				// shape config
			},
		},
		selection: {
			selectionActionOptions: {
				// selection action config
			},
		},
	},
})
```

### Class Method

```ts
import ImageMark, { SelectionPlugin } from 'mark-img'

// Register globally
ImageMark.usePlugin(SelectionPlugin, {
	// plugin options
})
```

### Instance Method

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

// Class method
imgMark.addPlugin(SelectionPlugin, {
	// plugin options
})

// Function method
imgMark.addPlugin(imageMarkInstance => {
	return new SelectionPlugin(imageMarkInstance, {
		// plugin options
	})
})
```

## Getting Plugin Instances

```ts
const shapePlugin = imgMark.getShapePlugin()
const selectionPlugin = imgMark.getSelectionPlugin()
const historyPlugin = imgMark.getHistoryPlugin()
const shortcutPlugin = imgMark.getShortcutPlugin()
```

## Removing Plugins

```ts
imgMark.removePlugin(SelectionPlugin)
```

For more, see [Plugin Class API](/en/api/plugin-class).

