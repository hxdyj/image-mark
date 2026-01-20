---
layout: doc
footer: false
---

# Circle

A circle is a shape defined by its center and radius.

## Drawing Method

Click twice to complete drawing:

1. First click to set the center position
2. Move mouse to preview the circle in real-time (distance from center to mouse position is the radius)
3. Second click to set the radius and complete drawing

You can hold the space key to pan the canvas while drawing.

## Data

```ts
export interface CircleData extends ShapeData {
	shapeName: 'circle'
	x: number
	y: number
	r: number
}
```
