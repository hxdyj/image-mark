---
layout: doc
footer: false
---

# Selection

通过鼠标选中`Shape`的 Action, 当使用 `selection` 插件的时候，这个 action 会在 `selection` 插件里被插件在每个`Shape`上边添加上。当然也可以自己在`Shape`实例上边添加此 action 来替换掉之前的 selection action，用于添加 initDrawFunc 来自定义 selection action 样式

## Options

```ts
export type SelectionDrawFunc = (selection: SelectionAction) => void

export type SelectionActionAttr = {
	stroke?: StrokeData
	fill?: string
	padding?: number
}

export type SelectionActionOptions = {
	initDrawFunc?: SelectionDrawFunc
	setAttr?: (action: SelectionAction) => SelectionActionAttr //自定义 selection action 的属性
}
```

## 实例属性

### selected

是否选中了当前`Shape`

## 实例方法

### getSelectionPlugin

获取当前`Selection`插件实例

### getSelectionShape

获取当前选中的`Shape`的 selection 的`Svg.js`的 shape 实例

### getSelectionId

获取当前选中的`Shape`的 selection 的 `id`

### disableSelection

禁用当前`Selection`插件

### enableSelection

启用当前`Selection`插件

### destroy

ImageMark 销毁时或者 unuseAction 时候调用
