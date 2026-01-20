---
layout: doc
footer: false
---

# PathLine

A path line is a freehand curve drawn by holding and dragging the mouse, recording all points the mouse passes through.

## Drawing Method

Hold and drag to complete drawing:
1. Hold down the left mouse button to start drawing
2. Drag the mouse to draw the path
3. Release the mouse to complete drawing

## Data

```ts
export interface PathLineData extends ShapeData {
	shapeName: 'pathline'
	points: number[]
}
```
