---
layout: doc
footer: false
---

# 鼠标绘制图形

本节介绍如何使用鼠标绘制图形的基本流程。如需了解所有图形类型，请查看 [所有图形类型](/start/all-shapes)。

## 基本流程

1. 获取 ShapePlugin 实例
2. 创建 Shape 实例
3. 调用 `startDrawing()` 开始绘制

## 示例：绘制矩形

```ts
import ImageMark, { ImageMarkRect } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

// 点击按钮开始绘制
document.querySelector('#draw-btn').onclick = () => {
	imgMark.getShapePlugin()?.startDrawing(new ImageMarkRect({
		shapeName: 'rect',
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	}, imgMark))
}
```

## 绘制时的快捷键

| 快捷键 | 作用 |
|--------|------|
| `Space` | 按住可拖拽平移画布 |
| `Enter` | 确认多边形/折线绘制 |
| `Delete` | 删除最后一个点 |
| `Esc` | 取消绘制 |
| `双击` | 结束多边形/折线绘制 |

补充说明：多边形至少需要 `3` 个点、折线至少需要 `2` 个点；如果在点数不足时结束绘制，本次绘制会被直接丢弃。
