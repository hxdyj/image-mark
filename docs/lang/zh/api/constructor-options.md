---
layout: doc
footer: false
---

## 初始化实例

```html
<div id="image-mark"></div>
```

```javascript
import ImageMark from 'mark-img'
const imageMark = new ImageMark('#image-mark', {
	// options
})
```

## Options

### el

- 必传
- 类型：`string` / `HTMLElement`
- 描述：图片标记的容器元素

### src

- 必传
- 类型：`string`
- 描述：图片的 URL 地址

### initScaleConfig

- 类型：`InitScaleConfig`

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

- 描述：初始化图片缩放的配置项

`InitScaleConfig` 详细配置项：

#### `to`

- 默认值：`'image'`
- 描述：缩放的目标，`to` 为 `'box'` 表示缩放到指定的矩形框的尺寸

#### `box`

- 描述：缩放的矩形框的坐标和尺寸，当 `to` 为 `'box'` 时必传

#### `startPosition`

- 默认值：`center`
- 描述：`image` 或者 `box` 的起始位置

#### `size`

- 默认值：`fit`
- 描述：缩放的尺寸

#### `padding`

- 默认值：`0.1`
- 描述：缩放的边距

#### `paddingUnit`

- 默认值：`%`
- 描述：边距的单位

### enableImageOutOfContainer

- 类型: `boolean`
- 默认值: `true`

是否允许图片超出容器的范围，`false` 时候类似 css background `cover` 效果

### pluginOptions

- 类型:

```typeScript
type PluginOptions = {
	[pluginName: string]: any
}
```

插件的配置项，具体请参考插件文档
