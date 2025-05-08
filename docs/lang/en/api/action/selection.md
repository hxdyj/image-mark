---
layout: doc
footer: false
---

# Selection

Action for selecting a Shape with the mouse. When using the selection plugin, this action will be added to each Shape by the plugin. You can also add this action to a Shape instance yourself to replace the previous selection action, allowing you to customize the selection action style by adding initDrawFunc.

## Options

```ts
export type SelectionDrawFunc = (selection: SelectionAction) => void
export type SelectionActionOptions = {
	initDrawFunc?: SelectionDrawFunc
}
```

## Instance Properties

### selected

Indicates whether the current `Shape` is selected.

## Instance Methods

### getSelectionPlugin

Get the `Selection` plugin instance.

### getSelectionShape

Get the `Svg.js` shape instance of the selected `Shape`.

### getSelectionId

Get the `id` of the selection for the currently selected `Shape`.

### disableSelection

Disable the `Selection` plugin.

### enableSelection

Enable the `Selection` plugin.

### destroy

alled when the `ImageMark` is `destroyed` or when `unuseAction` is invoked.
