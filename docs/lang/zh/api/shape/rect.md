---
layout: doc
footer: false
---

# 矩形

矩形是由四个点组成的形状，可以用来表示矩形区域。

## Data

```ts
export interface RectData extends BoundingBox, ShapeData {
	shapeName: 'rect'
	x: number
	y: number
	width: number
	height: number
}
```
