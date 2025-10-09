---
layout: doc
footer: false
---

# Selection

Action for selecting a Shape with the mouse. When using the selection plugin, this action will be added to each Shape by the plugin. You can also add this action to a Shape instance yourself to replace the previous selection action, allowing you to customize the selection action style by adding initDrawFunc.

## Options

```ts
export type SelectionDrawFunc = (selection: SelectionAction) => void

export type SelectionActionAttr = {
	stroke?: StrokeData
	fill?: string
	padding?: number
	whileSelectedEditShape?: boolean // Whether to switch the current `Shape` to edit state when selected
}

export type SelectionActionOptions = {
	initDrawFunc?: SelectionDrawFunc
	setAttr?: (action: SelectionAction) => SelectionActionAttr //customize the selection action's attributes
}
```

## Static Properties

### actionName

`selection`

## Instance Properties

### selected

Indicates whether the current `Shape` is selected.

## Instance Methods

### getSelectionActionOptions

```ts
// Get selectionAction configuration
getSelectionActionOptions(): SelectionActionOptions
```

### getSelectionShape

```ts
// Get the `Svg.js` shape instance of the selected `Shape`
getSelectionShape(): Shape | undefined
```

### getSelectionId

```ts
// Get the `id` of the selection for the currently selected `Shape`
getSelectionId(): string
```

### disableSelection

```ts
// Disable the `Selection` plugin
disableSelection(): void
```

### enableSelection

```ts
// Enable the `Selection` plugin
enableSelection(): void
```

### destroy

```ts
// Called when the `ImageMark` is `destroyed` or when `unuseAction` is invoked
destroy(): void
```
