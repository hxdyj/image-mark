---
layout: doc
footer: false
---

# 如何使用插件

ImageMark 会在导入的时候自动使用内置的 [`shape`](/api/plugin/shape) 和 [`selection`](/api/plugin/selection) 插件。如果不希望自动使用,可以使用[`useDefaultPlugin`](/api/constructor-methods#usedefaultplugin)方法取消。

## 示例

### class 方式

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

### 函数方式

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
