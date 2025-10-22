---
layout: doc
footer: false
---

# Start

## Install

```shell
npm i mark-img
# Install the @svgdotjs/svg.js library, which is a dependency of mark-img
npm install @svgdotjs/svg.js
```

## Usage

### UMD

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- import style -->
		<!-- [!code highlight] -->
		<link rel="stylesheet" href="../dist/style.css" />
	</head>
	<body>
		<div id="container" style="width: 800px;height: 600px;"></div>
		<!-- import @svgdotjs/svg.js library -->
		<!-- [!code highlight] -->
		<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@latest/dist/svg.min.js"></script>
		<!-- import mark-img library -->
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
// import style
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
