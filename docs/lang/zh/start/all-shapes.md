---
layout: doc
footer: false
---

# 所有图形类型

mark-img 内置了 8 种图形类型，满足不同的标注场景。

## 图形概览

| 图形 | shapeName | 适用场景 | 详细 API |
|------|-----------|---------|---------|
| 点 | `dot` | 关键点标注 | [Dot API](/api/shape/dot) |
| 直线 | `line` | 测量、方向标注 | [Line API](/api/shape/line) |
| 曲线 | `pathline` | 自由路径、轨迹 | [PathLine API](/api/shape/path-line) |
| 折线 | `polyline` | 路径、边界线 | [PolyLine API](/api/shape/poly-line) |
| 矩形 | `rect` | 目标检测、区域框选 | [Rect API](/api/shape/rect) |
| 圆形 | `circle` | 圆形目标标注 | [Circle API](/api/shape/circle) |
| 多边形 | `polygon` | 不规则区域、精确分割 | [Polygon API](/api/shape/polygon) |
| 图片 | `image` | 图标、水印 | [Image API](/api/shape/image) |

## 绘制图形

所有图形都通过 `ShapePlugin.startDrawing()` 方法开始绘制。

### 点 (Dot)

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

点击一次完成绘制。

### 直线 (Line)

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

点击两次完成绘制：第一次确定起点，第二次确定终点。

### 曲线 (PathLine)

```ts
import { ImageMarkPathLine } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPathLine({
	shapeName: 'pathline',
	points: [],
}, imgMark))
```

按住鼠标拖动绘制自由曲线，松开完成。

### 折线 (PolyLine)

```ts
import { ImageMarkPolyLine } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPolyLine({
	shapeName: 'polyline',
	points: [],
}, imgMark))
```

- 点击添加折点
- `Enter` 确认完成
- `Delete` 删除最后一个点
- `Esc` 取消绘制

### 矩形 (Rect)

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

点击两次完成绘制：第一次确定一角，第二次确定对角。

### 圆形 (Circle)

```ts
import { ImageMarkCircle } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkCircle({
	shapeName: 'circle',
	x: 0,
	y: 0,
	r: 0,
}, imgMark))
```

点击两次完成绘制：第一次确定圆心，第二次确定半径。

### 多边形 (Polygon)

```ts
import { ImageMarkPolygon } from 'mark-img'

imgMark.getShapePlugin()?.startDrawing(new ImageMarkPolygon({
	shapeName: 'polygon',
	points: [],
}, imgMark))
```

- 点击添加顶点
- `Enter` 确认完成（自动闭合）
- `Delete` 删除最后一个顶点
- `Esc` 取消绘制

### 图片 (Image)

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

点击两次确定图片位置和大小。

## 初始化时添加图形

除了动态绘制，也可以在初始化时传入图形数据：

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

## 常用操作

```ts
// 获取所有图形数据
const data = imgMark.getShapePlugin()?.data

// 设置图形数据（替换）
imgMark.getShapePlugin()?.setData(shapeDataList)

// 删除指定图形
imgMark.getShapePlugin()?.removeNode(shapeInstance)

// 删除所有图形
imgMark.getShapePlugin()?.removeAllNodes()
```

更多方法请查看 [Shape Plugin API](/api/plugin/shape)。
