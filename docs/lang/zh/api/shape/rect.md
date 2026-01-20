---
layout: doc
footer: false
---

# 矩形

矩形是由四个点组成的形状，可以用来表示矩形区域。

## 绘制方式

点击两次完成绘制：
1. 第一次点击确定矩形的一个角点
2. 移动鼠标实时预览矩形
3. 第二次点击确定对角点并完成绘制

绘制过程中可按住空格键拖拽平移画布。

## Data

```ts
export interface RectData extends BoundingBox, ShapeData {
	shapeName: 'rect'
	x: number
	y: number
	width: number
	height: number
}
```
