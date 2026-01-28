---
layout: doc
footer: false
---

# PolyLine

A polyline is an open line segment formed by connecting multiple points, created by clicking multiple times to add nodes.

## Drawing Method

Click multiple times to complete drawing:
1. Click on the canvas to add the first point
2. Continue clicking to add more nodes
3. Move mouse to preview the next line segment in real-time
4. Press `Enter` to confirm and complete drawing, or press `Esc` to cancel
5. Press `Backspace` to delete the last point

You can hold the space key to pan the canvas while drawing.

## Editing

After selecting a polyline, it enters edit mode:
1. Drag vertices to adjust the polyline shape
2. Midpoint controls with a plus sign are displayed between adjacent vertices. Click a midpoint to insert a new vertex at that position
3. Double-click a vertex to delete it (polyline must keep at least 2 vertices)
4. Use `ShapeOptions.enableEditAddMidPoint` to control whether midpoints are displayed
5. Use `ShapeOptions.enableEditDropPoint` to control whether double-click to delete vertex is enabled

## Data

```ts
export interface PolyLineData extends ShapeData {
	shapeName: 'polyline'
	points: number[]
}
```
