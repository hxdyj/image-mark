---
layout: doc
footer: false
---

# Action Class

The Action class is used to define actions for `Shape`, and it serves as the base class for all actions. You can define your own actions by inheriting from the Action class.

## Types

```ts
export type ActionOptions = {
	[key: string]: any
}
```

## Static Properties

### actionName

The name of the action, a string type.

### actionOptions

Type: `ActionOptions`

## Methods

### destroy

```ts
// The method called when the action is destroyed
destroy(): void
```

### getOptions

```ts
// Get configuration
getOptions<T extends ActionOptions = ActionOptions>(options?: T): T
```

### onContainerMouseMove

```ts
// Container mouse move event trigger
onContainerMouseMove(e: MouseEvent): void
```

### onDocumentMouseMove

```ts
// Document mouse move event trigger
onDocumentMouseMove(e: MouseEvent): void
```

### onDocumentMouseUp

```ts
// Document mouse up event trigger
onDocumentMouseUp(e: MouseEvent): void
```

### onReadonlyChange

```ts
// Readonly state change trigger
onReadonlyChange(readonly: boolean): void
```
