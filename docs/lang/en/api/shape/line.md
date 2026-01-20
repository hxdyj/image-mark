---
layout: doc
footer: false
---

# Line

A line is a shape composed of two points, used to represent a straight line.

## Drawing Method

Click twice to complete drawing:
1. First click to set the starting point
2. Move mouse to preview the line in real-time
3. Second click to set the ending point and complete drawing

You can hold the space key to pan the canvas while drawing.

## Data

```ts
export interface LineData extends ShapeData {
	shapeName: 'line'
	x: number
	y: number
	x2: number
	y2: number
}
```
