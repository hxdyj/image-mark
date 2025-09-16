---
layout: doc
footer: false
---

## Initialize Instance

```html
<div id="image-mark"></div>
```

```typescript
import ImageMark from 'mark-img'

const imageMark = new ImageMark({
	// options
	el: ContainerType  //  The container element for image marking. eg： #container
	src: string   // The URL address of the image
	initScaleConfig?: ({  // Configuration items for initializing image scaling
		to?: 'image' // The target for scaling image
	} | {
		to: 'box' // The target for scaling box
		box: BoundingBox // The bounding box for scaling
	}) & {
		startPosition?: StartPosition  // The starting position of the `image` or `box`, defaults is `center`
		size?: InitialScaleSize // The size for scaling, defaults is `fit`
		padding?: number // The padding for scaling, defaults is `0.1`
		paddingUnit?: 'px' | '%' // The unit for padding, defaults is `%`
	}
	action?: {
		enableDrawShapeOutOfImg?: boolean // Whether to allow drawing shapes to exceed the image, default is `false`
		enableMoveShapeOutOfImg?: boolean // Whether to allow moving shapes to exceed the image, default is `false`
		enableImageOutOfContainer?: boolean // Whether to allow the image to exceed the container's range, default is `true`
	}
	pluginOptions?: {
		[key: string]: any // [pluginName]: [pluginOptions] plugin's configuration, see more at plugin document
	}
})
```

## Types

```typeScript
export type ContainerType = string | HTMLElement;

export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

export type StartPosition = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'

export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'

```
