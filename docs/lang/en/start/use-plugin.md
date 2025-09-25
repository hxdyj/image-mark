---
layout: doc
footer: false
---

# How to Use Plugins

ImageMark will automatically use the built-in [`shape`](/en/api/plugin/shape) , [`selection`](/en/api/plugin/selection) , [`history`](/en/api/plugin/history) , [`shortcut`](/en/api/plugin/shortcut) plugins when importing. If you do not wish to use them automatically, you can use the [`unuseDefaultPlugin`](/en/api/constructor-methods#unusedefaultplugin) method to disable.

## Example

### Class Method

```ts
import ImageMark, { SelectionPlugin } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(SelectionPlugin, {
	// plugin options
})
```

### Function Method

```ts
import ImageMark, { SelectionPlugin } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(imageMarkInstance => {
	return new SelectionPlugin(imageMarkInstance, {
		// plugin options
	})
})
```
