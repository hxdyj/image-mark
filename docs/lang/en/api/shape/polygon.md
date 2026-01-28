---
layout: doc
footer: false
---

# Polygon

A polygon is a closed shape formed by connecting multiple points, created by clicking multiple times to add nodes.

## Drawing Method

Click multiple times to complete drawing:
1. Click on the canvas to add the first point
2. Continue clicking to add more nodes
3. Move mouse to preview the next edge in real-time
4. Press `Enter` to confirm and complete drawing (auto-closes), or press `Esc` to cancel
5. Press `Backspace` to delete the last point

You can hold the space key to pan the canvas while drawing.

## Editing

After selecting a polygon, it enters edit mode:
1. Drag vertices to adjust the polygon shape
2. Midpoint controls with a plus sign are displayed between adjacent vertices. Click a midpoint to insert a new vertex at that position
3. Use `ShapeOptions.enableEditAddMidPoint` to control whether midpoints are displayed

## Data

```ts
export interface PolygonData extends ShapeData {
	shapeName: 'polygon'
	points: number[]
}
```
