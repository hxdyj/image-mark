---
layout: doc
footer: false
---

# Minimap Plugin

Minimap plugin that displays a thumbnail overview in the corner of the canvas, showing the image and all shapes. Supports quick canvas navigation by clicking or dragging on the minimap.

## Types

```typescript
export type MinimapPluginOptions = {
	size?: number;  // Maximum size of the minimap (max of width or height), default 200
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';  // Position, default 'bottom-right'
	padding?: number;  // Distance from the container edge, default 20
	border?: {
		width?: number;  // Border width, default 2
		color?: string;  // Border color, default '#333'
	};
	background?: string;  // Background color, default 'rgba(255, 255, 255, 0.9)'
	viewportStyle?: {
		stroke?: string;  // Viewport rectangle stroke color, default '#FF7D00'
		strokeWidth?: number;  // Viewport rectangle stroke width, default 2
		fill?: string;  // Viewport rectangle fill color, default 'rgba(255, 125, 0, 0.1)'
	};
	shapeStyle?: {
		fill?: string;  // Shape fill color, default 'rgba(255, 125, 0, 0.3)'
		stroke?: string;  // Shape stroke color, default '#FF7D00'
		strokeWidth?: number;  // Shape stroke width, default 1
	};
	opacity?: number;  // Overall minimap opacity, default 1
	constrainToImage?: boolean;  // Whether to constrain viewport within image bounds when operating minimap, defaults to imageFullOfContainer setting
}
```

## constructor

```ts
// Create MinimapPlugin instance
constructor(
  imageMarkInstance: ImageMark,
  pluginOptions?: MinimapPluginOptions
): MinimapPlugin
```

## Static Properties

### pluginName

`minimap`

### pluginOptions

Default configuration:

```typescript
{
	size: 200,
	position: 'bottom-right',
	padding: 20,
	border: {
		width: 2,
		color: '#333'
	},
	background: 'rgba(255, 255, 255, 0.9)',
	viewportStyle: {
		stroke: '#FF7D00',
		strokeWidth: 2,
		fill: 'rgba(255, 125, 0, 0.1)'
	},
	shapeStyle: {
		fill: 'rgba(255, 125, 0, 0.3)',
		stroke: '#FF7D00',
		strokeWidth: 1
	},
	opacity: 1
}
```

## Features

### Thumbnail Display

The plugin renders a thumbnail in the specified corner of the canvas container (configured via `position`), including:

- **Background image**: A scaled-down version of the original image
- **Shape annotations**: Simplified rendering of all added shapes (Rect, Circle, Polygon, etc.)
- **Viewport rectangle**: An orange semi-transparent rectangle indicating the current visible area of the main canvas

### Interactions

- **Left-click**: Click anywhere on the minimap to move the main canvas viewport center to the corresponding image position
- **Left-click drag**: Hold the left mouse button and drag on the minimap to continuously move the main canvas viewport
- **Context menu**: Right-click context menu events are prevented from bubbling up to the main canvas

### Real-time Sync

The minimap automatically updates when:

- The main canvas is panned (translated)
- The main canvas is zoomed (scaled)
- Shapes are added, deleted, or modified
- The container is resized (rerender)

## Drawing Shapes in the Minimap

Each shape type can implement the `drawMinimap` method to customize how it is rendered in the minimap. If a shape does not implement this method, it will not be displayed in the minimap.

```typescript
// MinimapDrawContext type
export type MinimapDrawContext = {
	ctx: CanvasRenderingContext2D;  // Canvas 2D rendering context
	scale: number;  // Scale ratio of minimap relative to the original image
	fill?: string;  // Fill color
	stroke?: string;  // Stroke color
	strokeWidth?: number;  // Stroke width
}

// Implement in Shape class
drawMinimap?(ctx: MinimapDrawContext): void
```

## Usage Examples

### Basic Usage

```ts
import ImageMark from 'mark-img'

// Use default plugins (includes MinimapPlugin)
ImageMark.useDefaultPlugin()
```

### Custom Configuration

```ts
import ImageMark, { MinimapPlugin } from 'mark-img'

ImageMark.usePlugin(MinimapPlugin, {
	size: 300,
	position: 'top-right',
	padding: 10,
	opacity: 0.8,
	viewportStyle: {
		stroke: '#0088ff',
		strokeWidth: 3,
		fill: 'rgba(0, 136, 255, 0.15)'
	}
})
```

## destroy

```ts
// Destroy the plugin, remove minimap DOM elements and all event listeners
destroy(): void
```
