---
layout: doc
footer: false
---

# 快捷键插件

快捷键插件，用于管理 ImageMark 中的键盘快捷键，支持通过键盘快捷键进行形状创建、删除、移动以及撤销/重做等各种操作。

## 类型定义

```typescript
export type ShortKeyValue = {
	keyName: string
	hotkeyOptions?: {
		element?: HTMLElement | null
		keyup?: boolean | null
		keydown?: boolean | null
		capture?: boolean
		splitKey?: string
		single?: boolean
	}
}

export type ShortcutKeyMap = {
	delete_shape: ShortKeyValue // 删除选中的形状，默认为 backspace
	delete_all_shape: ShortKeyValue // 删除所有形状，默认为 ctrl/command + backspace

	move_mode: ShortKeyValue // 进入移动模式，默认为 space

	draw_dot: ShortKeyValue // 绘制点，默认为 alt/option + 1
	draw_line: ShortKeyValue // 绘制线，默认为 alt/option + 2
	draw_pathline: ShortKeyValue // 绘制路径，默认为 alt/option + 3
	draw_polyline: ShortKeyValue // 绘制折线，默认为 alt/option + 4
	draw_rect: ShortKeyValue // 绘制矩形，默认为 alt/option + 5
	draw_circle: ShortKeyValue // 绘制圆形，默认为 alt/option + 6
	draw_polygon: ShortKeyValue // 绘制多边形，默认为 alt/option + 7

	drawing_delete_point: ShortKeyValue // 绘制时删除点，默认为 backspace
	end_drawing: ShortKeyValue // 结束绘制，默认为 esc
	confirm_draw: ShortKeyValue // 确认绘制，默认为 enter

	undo: ShortKeyValue // 撤销，默认为 ctrl/command + z
	redo: ShortKeyValue // 重做，默认为 ctrl/command + y
}

export type ShortcutPluginOptions = {
	autoActive: boolean // 是否自动激活快捷键作用域，默认为 true
	keyMap: ShortcutKeyMap
}
```

## 构造函数

```ts
// 创建 ShortcutPlugin 实例
constructor(
  imageMarkInstance: ImageMark,
  options?: DeepPartial<ShortcutPluginOptions>
): ShortcutPlugin
```

## 静态属性

### pluginName

`shortcut`

## 实例方法

### onContainerMouseDown

```ts
// 处理容器鼠标按下事件以激活快捷键作用域
onContainerMouseDown(event: MouseEvent): void
```

### bindEvent

```ts
// 绑定插件事件
bindEvent(): void
```

### unbindEvent

```ts
// 解绑插件事件
unbindEvent(): void
```

### getScopeName

```ts
// 获取热键的作用域名称
getScopeName(): string
```

### activeScope

```ts
// 激活热键作用域
activeScope(): void
```

### eventCaller

```ts
// 为特定的按键事件调用相应的处理程序
eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent): void
```

### bindKeyMap

```ts
// 根据键映射配置绑定键盘快捷键
bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>): void
```

### unbindKeyMap

```ts
// 解绑所有键盘快捷键
unbindKeyMap(): void
```

### getOptions

```ts
// 获取合并后的插件选项
getOptions(options?: DeepPartial<ShortcutPluginOptions>): ShortcutPluginOptions
```

### destroy

```ts
// 销毁插件并清理资源
destroy(): void
```
