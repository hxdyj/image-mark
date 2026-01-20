---
layout: doc
footer: false
---

# Dot

A dot is a simple shape that represents a position on the canvas.

## Drawing Method

Single click to complete drawing: Click anywhere on the canvas to create a dot.

## Data

```ts
export interface DotData extends ShapeData {
	shapeName: 'dot'
	x: number
	y: number
	r: number
}
```
