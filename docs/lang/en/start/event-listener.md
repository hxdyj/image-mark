---
layout: doc
footer: false
---

# How to Listen Events

Supported [events](/en/api/constructor-on)

## Example

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: '/public/img/demo-parking.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
		},
	},
})
	// Listen to shape add event
	.on('shape_add', (data: ShapeData, shapeInstance: ShapeInstance) => {
		// do something
	})
```
