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

## 编辑方式

选中多边形后进入编辑模式：
1. 拖动顶点可调整多边形形状
2. 在相邻顶点之间会显示带有加号的中位点控制点，点击中位点可在该位置插入新的顶点
3. 双击顶点可删除该顶点（多边形至少保留 3 个顶点）
4. 可通过 `ShapeOptions.enableEditAddMidPoint` 控制是否显示中位点
5. 可通过 `ShapeOptions.enableEditDropPoint` 控制是否启用双击删除顶点功能

## Data

```ts
export interface PolygonData extends ShapeData {
	shapeName: 'polygon'
	points: number[]
}
```
