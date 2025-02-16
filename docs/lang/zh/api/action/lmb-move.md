---
layout: doc
footer: false
---

# LmbMove

鼠标左键移动 Shape 的动作

## Options

```ts
export type LmbMoveActionOptions = {
	onStart?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // 开始移动时触发
	onMove?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // 移动时触发
	onEnd?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // 结束移动时触发
	limit?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		nextTransform: MatrixExtract //Svg.js 的 MatrixExtract 类型
	) => ArrayPoint // 限制移动范围
}
```

## 方法

### disableMove

禁用鼠标左键移动 Shape 的动作。

### enableMove

启用鼠标左键移动 Shape 的动作。

### getEnableMove

获取当前是否允许鼠标左键移动 Shape 的动作。

### destroy

销毁当前实例时候调用
