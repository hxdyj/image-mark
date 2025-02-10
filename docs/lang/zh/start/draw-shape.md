---
layout: doc
footer: false
---

# 怎么用鼠标绘制图形

### 示例

使用鼠标画一个 Rect。

```html
<div>
	<div id="container"></div>
	<button id="drawing-rect">Draw Rect</button>
</div>

<script module>
	import ImageMark, { ShapePlugin } from 'mark-img'

	const imgMark = new ImageMark({
		el: '#container',
		src: '/public/img/demo-parking.jpg',
		pluginOptions: {
			shape: {
				shapeList: [],
			},
		},
	})

	const btn = document.querySelector('#drawing-rect')

	btn.onclick = () => {
		const shapePlugin = imgMark.plugin[ShapePlugin.pluginName]
		const newRectShapeData = {
			shapeName: 'rect',
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		}

		const newRectShape = new ImageMarkRect(newRectShapeData, imgMark, {
			// shape options
		})

		shapePlugin.startDrawing(rectInstance) // 开始绘制
	}
</script>
```
