---
layout: doc
footer: false
---

# All Shape Types

mark-img comes with 8 built-in shape types for different annotation scenarios.

## Shape Overview

| Shape | shapeName | Use Case | API |
|-------|-----------|----------|-----|
| Dot | `dot` | Key point annotation | [Dot API](/en/api/shape/dot) |
| Line | `line` | Measurement, direction | [Line API](/en/api/shape/line) |
| PathLine | `pathline` | Free path, trajectory | [PathLine API](/en/api/shape/path-line) |
| PolyLine | `polyline` | Path, boundary line | [PolyLine API](/en/api/shape/poly-line) |
| Rect | `rect` | Object detection, area selection | [Rect API](/en/api/shape/rect) |
| Circle | `circle` | Circular target annotation | [Circle API](/en/api/shape/circle) |
| Polygon | `polygon` | Irregular region, segmentation | [Polygon API](/en/api/shape/polygon) |
| Image | `image` | Icon, watermark | [Image API](/en/api/shape/image) |

## Drawing Shapes

All shapes are drawn using the `ShapePlugin.startDrawing()` method.

### Dot

```ts
import ImageMark, { ImageMarkDot } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.getShapePlugin()?.startDrawing(new ImageMarkDot({
	shapeName: 'dot',
	x: 0,
	y: 0,
	r: 5,
}, imgMark))
```

Click once to place the dot.

### Line

```ts
import { ImageMarkLine } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkLine({
	shapeName: 'line',
	x: 0,
	y: 0,
	x2: 0,
	y2: 0,
}, imgMark))
```

Click twice: first to set the start point, second to set the end point.

### PathLine

```ts
import { ImageMarkPathLine } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPathLine({
	shapeName: 'pathline',
	points: [],
}, imgMark))
```

Hold and drag to draw a free-form curve, release to finish.

### PolyLine

```ts
import { ImageMarkPolyLine } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPolyLine({
	shapeName: 'polyline',
	points: [],
}, imgMark))
```

- Click to add points
- `Enter` to confirm
- `Delete` to remove last point
- `Esc` to cancel

### Rect

```ts
import { ImageMarkRect } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkRect({
	shapeName: 'rect',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
}, imgMark))
```

Click twice: first for one corner, second for the opposite corner.

### Circle

```ts
import { ImageMarkCircle } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkCircle({
	shapeName: 'circle',
	x: 0,
	y: 0,
	r: 0,
}, imgMark))
```

Click twice: first for center, second to set radius.

### Polygon

```ts
import { ImageMarkPolygon } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPolygon({
	shapeName: 'polygon',
	points: [],
}, imgMark))
```

- Click to add vertices
- `Enter` to confirm (auto-close)
- `Delete` to remove last vertex
- `Esc` to cancel

### Image

```ts
import { ImageMarkImage } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkImage({
	shapeName: 'image',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	src: '/img/icon.png',
}, imgMark))
```

Click twice to set position and size.

## Adding Shapes on Initialization

You can also pass shape data during initialization:

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [
				{ shapeName: 'rect', x: 100, y: 100, width: 200, height: 150 },
				{ shapeName: 'circle', x: 400, y: 300, r: 50 },
				{ shapeName: 'polygon', points: [[100, 200], [150, 250], [100, 300]] },
			],
		},
	},
})
```

## Common Operations

```ts
// Get all shape data
const data = imgMark.getShapePlugin()?.data

// Set shape data (replace all)
imgMark.getShapePlugin()?.setData(shapeDataList)

// Remove a specific shape
imgMark.getShapePlugin()?.removeNode(shapeInstance)

// Remove all shapes
imgMark.getShapePlugin()?.removeAllNodes()
```

For more methods, see [Shape Plugin API](/en/api/plugin/shape).

