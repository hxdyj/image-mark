---
layout: doc
footer: false
---

# 开始

## 安装

```shell
npm install mark-img
# 安装 @svgdotjs/svg.js 库，mark-img 依赖它
npm install @svgdotjs/svg.js
```

## 使用

### UMD

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- 引入样式 -->
		<!-- [!code highlight] -->
		<link rel="stylesheet" href="../dist/style.css" />
	</head>
	<body>
		<div id="container" style="width: 800px;height: 600px;"></div>
		<!-- 引入 @svgdotjs/svg.js 库 -->
		<!-- [!code highlight] -->
		<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@latest/dist/svg.min.js"></script>
		<!-- 引入 mark-img 库 -->
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
// 引入样式
import 'mark-img/dist/style.css' // [!code highlight]

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
