---
layout: doc
footer: false
---

## Initialize Instance

```html
<div id="image-mark"></div>
```

```javascript
import ImageMark from 'mark-img'
const imageMark = new ImageMark({
	// options
})
```

## Options

### el

- `Required`
- Type: `string` / `HTMLElement`
- Description: The container element for image marking

### src

- `Required`
- Type: `string`
- Description: The URL address of the image

### initScaleConfig

- Type: `InitScaleConfig`

```typeScript
export type StartPosition = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom'

export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover'

export type BoundingBox = {
	x: number
	y: number
	width: number
	height: number
}

type InitScaleConfig = {
	to?: 'image'
}|{
	to: 'box'
	box: BoundingBox
}&{
	startPosition?: StartPosition
	size?: InitialScaleSize
	padding?: number
	paddingUnit?: 'px' | '%'
}
```

- Description: Configuration items for initializing image scaling

`InitScaleConfig` detailed configuration items:

#### `to`

- Default value: `'image'`
- Description: The target for scaling, `'box'` means scaling to the size of the specified bounding box

#### `box`

- Description: Coordinates and dimensions of the bounding box for scaling, required when to is `'box'`

#### `startPosition`

- Default value: `center`
- Description: The starting position of the `image` or `box`

#### `size`

- Default value: `fit`
- Description: The size for scaling

#### `padding`

- Default value: `0.1`
- Description: Padding for scaling

#### `paddingUnit`

- Default value: `%`
- Description: Unit for padding

### enableImageOutOfContainer

- Type: `boolean`
- Default value: `true`

Whether to allow the image to exceed the container's range, set to `false` to mimic the CSS background `cover` effect

### pluginOptions

- Type:

```typeScript
type PluginOptions = {
	[pluginName: string]: any
}
```

Configuration items for plugins, please refer to the plugin documentation for details
