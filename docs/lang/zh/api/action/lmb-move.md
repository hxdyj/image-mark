---
layout: doc
footer: false
---

# LmbMove

鼠标左键移动 Shape 的动作

## Options

```ts
export type LmbMoveActionOptions = {
	moveable?: boolean
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

## 静态属性

### actionName

`lmbMove`

## 方法

### getLmbMoveActionOptions

```ts
// 获取 lmbAction 配置
getLmbMoveActionOptions(): void

```

### disableMove

```ts
// 禁用鼠标左键移动 Shape 的动作
disableMove(): void
```

### enableMove

```ts
// 启用鼠标左键移动 Shape 的动作
enableMove(): void
```

### getEnableMove

```ts
// 获取当前是否允许鼠标左键移动 Shape 的动作
getEnableMove(): boolean
```

### destroy

```ts
// 销毁当前实例时候调用
destroy(): void
```
