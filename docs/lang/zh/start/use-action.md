---
layout: doc
footer: false
---

# 如何使用 Action

Action 是附加在 Shape 上的行为，用于控制图形的交互方式。例如：选中时高亮显示、鼠标拖动图形等。

## 内置 Action

| Action | 功能 | API |
|--------|------|-----|
| [SelectionAction](/api/action/selection) | 选中图形时显示选框 | [详情](/api/action/selection) |
| [LmbMoveAction](/api/action/lmb-move) | 鼠标左键拖动图形 | [详情](/api/action/lmb-move) |

- `SelectionAction` 由 [Selection Plugin](/api/plugin/selection) 自动添加，无需手动管理
- `LmbMoveAction` 默认已启用，可通过 `unuseDefaultAction` 取消

## 使用方式

### class 方式（全局生效）

```ts
import { ImageMarkShape, LmbMoveAction } from 'mark-img'

// 所有 Shape 都会拥有此 Action
ImageMarkShape.useAction(LmbMoveAction, {
	// action options
})
```

### 实例方式（单个图形）

```ts
import ImageMark, { ShapePlugin, LmbMoveAction, ImageMarkRect } from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

imgMark.addPlugin(imageMarkInstance => {
	const shapePluginInstance = new ShapePlugin(imageMarkInstance)
	shapePluginInstance.addShape(ImageMarkRect, {
		afterRender(shapeInstance) {
			// 只给这个 Shape 类型添加 Action
			shapeInstance.addAction(LmbMoveAction, {
				// action options
			})
		},
	})
})
```

## 禁用 Action

```ts
const shapePlugin = imgMark.getShapePlugin()

// 禁用指定 action
shapePlugin?.disableAction('lmb-move')

// 重新启用
shapePlugin?.enableAction('lmb-move')
```

## 取消默认 Action

```ts
import { ImageMarkShape, LmbMoveAction } from 'mark-img'

// 取消所有默认 Action
ImageMarkShape.unuseDefaultAction()

// 取消特定 Action
ImageMarkShape.unuseAction(LmbMoveAction)
```

更多信息请查看 [Action 类 API](/api/action-class)。
