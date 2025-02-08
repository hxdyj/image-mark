---
layout: doc
footer: false
---

# Rect

Rectangle is a shape composed of four points, used to represent a rectangular area.

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
