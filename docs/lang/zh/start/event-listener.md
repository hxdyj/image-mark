---
layout: doc
footer: false
---

# 如何监听事件

支持的[事件列表](/api/constructor-on)

## 示例

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
	//监听shape添加事件
	.on('shape_add', (data: ShapeData, shapeInstance: ShapeInstance) => {
		// do something
	})
```
