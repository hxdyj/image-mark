---
layout: doc
footer: false
---

# 撤销与重做

mark-img 内置了 [History 插件](/api/plugin/history)，自动记录图形的增删改操作，支持撤销和重做。

## 基本用法

History 插件是默认加载的，无需手动添加。

```ts
const historyPlugin = imgMark.getHistoryPlugin()

// 撤销
historyPlugin?.undo()

// 重做
historyPlugin?.redo()

// 获取栈信息
const info = historyPlugin?.getStackInfo()
console.log('可撤销', info?.undo, '步')
console.log('可重做', info?.redo, '步')

// 清空历史记录
historyPlugin?.clear()
```

## 监听历史记录变化

```ts
imgMark.on('history_change', (info) => {
	console.log('可撤销', info.undo, '步，可重做', info.redo, '步')
})
```

## 配合快捷键

内置的 [Shortcut 插件](/api/plugin/shortcut) 已默认绑定了快捷键：

| 快捷键 | 操作 |
|--------|------|
| `Ctrl/Command + Z` | 撤销 |
| `Ctrl/Command + Y` | 重做 |

## 哪些操作会被记录

- 添加图形（鼠标绘制、`addNode`）
- 删除图形（`removeNode`、`removeNodes`、`removeAllNodes`）
- 修改图形数据（`startModifyData` + `updateData`）

::: tip
调用 `startModifyData()` 是触发历史记录的关键。如果直接修改 `data` 而不调用 `startModifyData()`，则不会记录到历史栈中。
:::

## 完整示例

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
		},
	},
})

// 监听历史变化，更新 UI 按钮状态
imgMark.on('history_change', (info) => {
	document.querySelector('#undo-btn').disabled = info.undo === 0
	document.querySelector('#redo-btn').disabled = info.redo === 0
	document.querySelector('#undo-count').textContent = info.undo
	document.querySelector('#redo-count').textContent = info.redo
})

// 绑定按钮
document.querySelector('#undo-btn').onclick = () => {
	imgMark.getHistoryPlugin()?.undo()
}

document.querySelector('#redo-btn').onclick = () => {
	imgMark.getHistoryPlugin()?.redo()
}
```

更多方法请查看 [History Plugin API](/api/plugin/history)。
