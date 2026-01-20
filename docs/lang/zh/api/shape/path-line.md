---
layout: doc
footer: false
---

# 路径线

路径线是通过按住鼠标拖拽绘制的自由曲线，会记录鼠标经过的所有点。

## 绘制方式

按住拖拽完成绘制：
1. 按住鼠标左键开始绘制
2. 拖拽鼠标绘制路径
3. 松开鼠标完成绘制

## Data

```ts
export interface PathLineData extends ShapeData {
	shapeName: 'pathline'
	points: number[]
}
```
