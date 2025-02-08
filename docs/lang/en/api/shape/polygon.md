---
layout: doc
footer: false
---

# Polygon

Polygon is a closed shape composed of multiple connected line segments.

## Data

```ts
export interface PolygonData extends ShapeData {
	shapeName: 'polygon'
	points: number[]
}
```
