---
layout: doc
footer: false
---

# 图片

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
