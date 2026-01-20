---
layout: doc
footer: false
---

# 圆形

圆形是由圆心和半径定义的形状。

## 绘制方式

点击两次完成绘制：
1. 第一次点击确定圆心位置
2. 移动鼠标实时预览圆形（圆心到鼠标位置的距离为半径）
3. 第二次点击确定半径并完成绘制

绘制过程中可按住空格键拖拽平移画布。

## Data

```ts
export interface CircleData extends ShapeData {
	shapeName: 'circle'
	x: number
	y: number
	r: number
}
```
