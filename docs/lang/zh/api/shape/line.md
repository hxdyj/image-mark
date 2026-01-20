---
layout: doc
footer: false
---

# 线条

线条是由两个点组成的形状，可以用来表示直线。

## 绘制方式

点击两次完成绘制：

1. 第一次点击确定起点位置
2. 移动鼠标实时预览线条
3. 第二次点击确定终点位置并完成绘制

绘制过程中可按住空格键拖拽平移画布。

## Data

```ts
export interface LineData extends ShapeData {
	shapeName: 'line'
	x: number
	y: number
	x2: number
	y2: number
}
```
