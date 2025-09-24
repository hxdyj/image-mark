---
layout: doc
footer: false
---

# History Plugin

History plugin, used to record and manage operation history in ImageMark, supporting undo and redo functionality.

## Types

```typescript
export type HistoryPluginOptions = {
	// History plugin configuration options
}
```

## constructor

```ts
// Create HistoryPlugin instance
constructor(
  imageMarkInstance: ImageMark
): HistoryPlugin
```

## Static Properties

### pluginName

`history`

## Instance Properties

### stack

History record stack, storing undoable historical operations

### redoStack

Redo stack, storing redoable historical operations

## Instance Methods

### getStackInfo

```ts
// Get history stack information
getStackInfo(): {
  undo: number,
  redo: number
}
```

### push

```ts
// Push new history record to the stack
push(history: History, clear = true): void
```

### undo

```ts
// Undo the previous operation
undo(): void
```

### redo

```ts
// Redo the previously undone operation
redo(): void
```

### clear

```ts
// Clear all history records
clear(): void
```

### destroy

```ts
// Destroy the plugin
destroy(): void
```

## Internal Classes

### History

Abstract base class for history records

```typescript
export abstract class History<T extends object | number | string = object> {
	static operate: string
	oldData: T | undefined
	newData: T | undefined
	setOldData(oldData: T): void
	setNewData(newData: T): void
	abstract undo(imageMarkInstance: ImageMark): void
	abstract redo(imageMarkInstance: ImageMark): void
}
```

### ShapeEditHistory

Shape edit history record class

```typescript
export class ShapeEditHistory extends History<ShapeData> {
	static operate = 'edit'
	constructor(oldData?: ShapeData, newData?: ShapeData)
	undo(imageMark: ImageMark): void
	redo(imageMark: ImageMark): void
}
```

### ShapeExistHistory

Shape add/delete history record class

```typescript
export class ShapeExistHistory extends History<ShapeData> {
	static operate = 'exist'
	constructor(oldData?: ShapeData, newData?: ShapeData)
	undo(imageMark: ImageMark): void
	redo(imageMark: ImageMark): void
}
```
