---
layout: doc
footer: false
---

# 多边形

多边形是由多个点连接而成的闭合形状，通过多次点击添加节点。

## 绘制方式

多次点击完成绘制：
1. 点击画布添加第一个点
2. 继续点击添加更多节点
3. 移动鼠标实时预览下一段边
4. 按 `Enter` 键确认完成绘制（自动闭合），或按 `Esc` 键取消绘制
5. 按 `Backspace` 键可删除最后一个点

绘制过程中可按住空格键拖拽平移画布。

## Data

```ts
export interface PolygonData extends ShapeData {
	shapeName: 'polygon'
	points: number[]
}
```
