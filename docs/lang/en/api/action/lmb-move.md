---
layout: doc
footer: false
---

# LmbMove

Action for moving a Shape with the left mouse button

## Options

```ts
export type LmbMoveActionOptions = {
	moveable?: boolean
	onStart?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // Triggered when movement starts
	onMove?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // Triggered during movement
	onEnd?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		event: MouseEvent
	) => void // Triggered when movement ends
	limit?: (
		imageMark: ImageMark,
		shape: ImageMarkShape,
		nextTransform: MatrixExtract //Svg.js MatrixExtract type
	) => ArrayPoint // Restrict movement range
}
```

## Static Properties

### actionName

`lmbMove`

## Methods

### getLmbMoveActionOptions

```ts
// Get lmbAction configuration
getLmbMoveActionOptions(): void
```

### disableMove

```ts
// Disable the action of moving a Shape with the left mouse button
disableMove(): void
```

### enableMove

```ts
// Enable the action of moving a Shape with the left mouse button
enableMove(): void
```

### getEnableMove

```ts
// Get whether the left mouse button movement of the Shape is currently allowed
getEnableMove(): boolean
```

### destroy

```ts
// Called when destroying the current instance
destroy(): void
```
