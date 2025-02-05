---
layout: doc
footer: false
---

# 多边形

多边形是由多个相连的线段组成的封闭形状。

## Data

```ts
export interface PolygonData extends ShapeData {
	shapeName: 'polygon'
	points: number[]
}
```
