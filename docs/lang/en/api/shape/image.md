---
layout: doc
footer: false
---

# Image

The image shape is used to place images on the canvas.

## Drawing Method

Click twice to complete drawing:
1. First click to set the starting position of the image
2. Move mouse to preview the image size in real-time
3. Second click to set the image size and complete drawing

You can hold the space key to pan the canvas while drawing.

## Data

```ts
export interface ImageData extends ShapeData {
	x: number
	y: number
	width?: number
	height?: number
	src: string
	shapeName: 'image'
}
```
