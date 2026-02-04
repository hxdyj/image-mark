---
layout: doc
footer: false
---

# 如何使用插件

ImageMark 的功能通过插件系统提供，除核心的画布拖动和缩放外，其他功能均以插件形式按需加载。

## 内置插件

| 插件 | 功能 | API |
|------|------|-----|
| [Shape](/api/plugin/shape) | 图形管理、鼠标绘制 | [详情](/api/plugin/shape) |
| [Selection](/api/plugin/selection) | 图形选中（单选/多选） | [详情](/api/plugin/selection) |
| [History](/api/plugin/history) | 撤销/重做 | [详情](/api/plugin/history) |
| [Shortcut](/api/plugin/shortcut) | 快捷键 | [详情](/api/plugin/shortcut) |
| [Minimap](/api/plugin/minimap) | 小地图 | [详情](/api/plugin/minimap) |

ImageMark 默认自动加载所有内置插件。如不需要，可以通过 [`unuseDefaultPlugin`](/api/constructor-methods#unusedefaultplugin) 取消。

## 使用方式

### 通过构造参数（推荐）

大多数情况通过 `pluginOptions` 传入配置即可：

```ts
import ImageMark from 'mark-img'

const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
	pluginOptions: {
		shape: {
			shapeList: [],
			shapeOptions: {
				// shape 配置
			},
		},
		selection: {
			selectionActionOptions: {
				// selection action 配置
			},
		},
	},
})
```

### class 方式

```ts
import ImageMark, { SelectionPlugin } from 'mark-img'

// 在类上注册（全局生效）
ImageMark.usePlugin(SelectionPlugin, {
	// plugin options
})
```

### 实例方式

```ts
const imgMark = new ImageMark({
	el: '#container',
	src: './example.jpg',
})

// class 方式
imgMark.addPlugin(SelectionPlugin, {
	// plugin options
})

// 函数方式
imgMark.addPlugin(imageMarkInstance => {
	return new SelectionPlugin(imageMarkInstance, {
		// plugin options
	})
})
```

## 获取插件实例

```ts
// 便捷方法
const shapePlugin = imgMark.getShapePlugin()
const selectionPlugin = imgMark.getSelectionPlugin()
const historyPlugin = imgMark.getHistoryPlugin()
const shortcutPlugin = imgMark.getShortcutPlugin()
```

## 移除插件

```ts
imgMark.removePlugin(SelectionPlugin)
```

更多信息请查看 [Plugin 类 API](/api/plugin-class)。
