---
layout: doc
footer: false
---

# History Plugin

历史记录插件，用于记录和管理 ImageMark 中的操作历史，支持撤销和重做功能。

## Types

```typescript
export type HistoryPluginOptions = {
	// 历史记录插件配置项
}
```

## constructor

```ts
// 创建 HistoryPlugin 实例
constructor(
  imageMarkInstance: ImageMark
): HistoryPlugin
```

## 静态属性

### pluginName

`history`

## 实例属性

### stack

历史记录栈，存储可撤销的历史操作

### redoStack

重做栈，存储可重做的历史操作

## 实例方法

### getStackInfo

```ts
// 获取历史记录栈信息
getStackInfo(): {
  undo: number,
  redo: number
}
```

### push

```ts
// 推送新的历史记录到栈中
push(history: History, clear = true): void
```

### undo

```ts
// 撤销上一步操作
undo(): void
```

### redo

```ts
// 重做上一步撤销的操作
redo(): void
```

### clear

```ts
// 清除所有历史记录
clear(): void
```

### destroy

```ts
// 销毁插件
destroy(): void
```

## 内部类

### History

历史记录的抽象基类

```typescript
export abstract class History<T extends object | number | string = object> {
	static operate: string
	oldData: T | undefined
	newData: T | undefined
	constructor(oldData?: T, newData?: T)
	setOldData(oldData: T): void
	setNewData(newData: T): void
	abstract undo(imageMarkInstance: ImageMark): void
	abstract redo(imageMarkInstance: ImageMark): void
}
```

### ShapeEditHistory

图形编辑历史记录类

```typescript
export class ShapeEditHistory extends History<ShapeData> {
	static operate = 'edit'
	constructor(oldData?: ShapeData, newData?: ShapeData)
	undo(imageMark: ImageMark): void
	redo(imageMark: ImageMark): void
}
```

### ShapeExistHistory

图形添加删除历史记录类

```typescript
export class ShapeExistHistory extends History<ShapeData> {
	static operate = 'exist'
	constructor(oldData?: ShapeData, newData?: ShapeData)
	undo(imageMark: ImageMark): void
	redo(imageMark: ImageMark): void
}
```
