---
layout: doc
footer: false
---

# 点

点是一个简单的形状，表示画布上的一个位置。

## 绘制方式

单击完成绘制：点击画布上的任意位置即可创建一个点。

## Data

```ts
export interface DotData extends ShapeData {
	shapeName: 'dot'
	x: number
	y: number
	r: number
}
```
