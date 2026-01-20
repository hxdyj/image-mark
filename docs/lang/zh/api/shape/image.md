---
layout: doc
footer: false
---

# 图片

图片形状用于在画布上放置图像。

## 绘制方式

点击两次完成绘制：
1. 第一次点击确定图片的起始位置
2. 移动鼠标实时预览图片大小
3. 第二次点击确定图片大小并完成绘制

绘制过程中可按住空格键拖拽平移画布。

## Data

```ts
export interface ImageData extends ShapeData {
	x: number
	y: number
	width?: number
	height?: number
	src: string
	shapeName: 'image'
}
```
