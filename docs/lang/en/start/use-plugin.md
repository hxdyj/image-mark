---
layout: doc
footer: false
---

# How to Use Plugins

ImageMark will automatically use the built-in [`shape`](/en/api/plugin/shape) and [`selection`](/en/api/plugin/selection) plugins when importing. If you do not wish to use them automatically, you can use the [`useDefaultPlugin`](/en/api/constructor-methods#usedefaultplugin) method to disable.

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
