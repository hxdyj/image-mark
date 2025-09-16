---
layout: doc
footer: false
---

# Selection Plugin

选中插件，配套 selection action 一起使用，单独使用插件的时候，插件会给每个 shape 上边注册 selection action。

## Types

```typescript
export type SelectionPluginOptions = {
	selectionActionOptions?: SelectionActionOptions //这个属性可以在 ImageMark 构造实例时候 pluginOptions['selection'].selectionActionOptions 或者 Selection Plugin 实例化constructor 的参数中传入
}

// 选择模式类型
export type SelectionType = 'single' | 'multiple'
```

## constructor

```ts
// 创建 SelectionPlugin 实例
constructor(
	imageMarkInstance: ImageMark,
	public selectionPluginOptions?: SelectionPluginOptions
): SelectionPlugin
```

## 静态属性

### pluginName

`selection`

## 实例属性

### selectShapeList

选中的 shape 列表

## 实例方法

### mode

```ts
// 切换多选单选模式
mode(newMode?: SelectionType): void
```

### getSelectionAction

```ts
// 获取某个 shape 的 selection action
getSelectionAction(shape: ImageMarkShape): SelectionAction | undefined
```

### selectShape

```ts
// 选中某个 shape
selectShape(shape: ImageMarkShape): void
```

### selectShapes

```ts
// 选中多个 shape
selectShapes(shapeList: ImageMarkShape[]): void
```

### unselectShape

```ts
// 取消选中某个 shape
unselectShape(shape: ImageMarkShape): void
```

### unselectShapes

```ts
// 取消选中多个 shape
unselectShapes(shapeList: ImageMarkShape[]): void
```

### clear

```ts
// 清除所有选中
clear(): void
```

### destroy

```ts
// 销毁插件
destroy(): void
```
