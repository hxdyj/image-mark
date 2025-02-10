---
layout: doc
footer: false
---

# 开始

## 安装

```shell
npm i mark-img
```

## 使用

### UMD

```html
<!DOCTYPE html>
<html lang="en">
	<body>
		<div id="container" style="width: 800px;height: 600px;"></div>
		<script src="../dist/index.umd.js"></script>
		<script>
			const ImageMark = window['mark-img'].ImageMark
			const imgMark = new ImageMark({
				el: '#container',
				src: '/public/img/demo-parking.jpg',
				pluginOptions: {
					shape: {
						shapeList: [
							{
								shapeName: 'rect',
								width: 100,
								height: 200,
								x: 100,
								y: 100,
							},
						],
					},
				},
			})
		</script>
	</body>
</html>
```

### ES

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: '/public/img/demo-parking.jpg',
	pluginOptions: {
		shape: {
			shapeList: [
				{
					shapeName: 'rect',
					width: 100,
					height: 200,
					x: 100,
					y: 100,
				},
			],
		},
	},
})
```
