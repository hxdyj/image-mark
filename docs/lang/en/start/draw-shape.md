---
layout: doc
footer: false
---

# Drawing Shapes with Mouse

This section introduces the basic flow of drawing shapes with a mouse. For all shape types, see [All Shape Types](/en/start/all-shapes).

## Basic Flow

1. Get the ShapePlugin instance
2. Create a Shape instance
3. Call `startDrawing()` to begin

## Example: Drawing a Rect

```ts
import ImageMark, { ImageMarkRect } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

// Click button to start drawing
document.querySelector('#draw-btn').onclick = () => {
	imgMark.getShapePlugin()?.startDrawing(
		new ImageMarkRect(
			{
				shapeName: 'rect',
				x: 0,
				y: 0,
				width: 0,
				height: 0,
			},
			imgMark
		)
	)
}
```

## Shortcuts While Drawing

| Shortcut       | Action                          |
| -------------- | ------------------------------- |
| `Space`        | Hold to pan the canvas          |
| `Enter`        | Confirm polygon/polyline        |
| `Delete`       | Remove last point               |
| `Esc`          | Cancel drawing                  |
| `Double-click` | Finish polygon/polyline drawing |

Additional note: A polygon requires at least `3` points, and a polyline requires at least `2` points. If drawing ends before reaching the minimum, the drawing is discarded.
