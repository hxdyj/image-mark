---
layout: doc
footer: false
---

# Rect

Rectangle is a shape composed of four points, used to represent a rectangular area.

## Drawing Method

Click twice to complete drawing:
1. First click to set one corner of the rectangle
2. Move mouse to preview the rectangle in real-time
3. Second click to set the opposite corner and complete drawing

You can hold the space key to pan the canvas while drawing.

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
