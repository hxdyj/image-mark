---
layout: doc
footer: false
---

# Shortcut Plugin

Shortcut plugin, used to manage keyboard shortcuts in ImageMark, supporting various operations such as shape creation, deletion, movement, and undo/redo functionality through keyboard shortcuts.

## Types

```typescript
export type ShortKeyValue = {
	keyName: string
	hotkeyName?: string
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
	delete_shape: ShortKeyValue // Delete selected shape(s), default backspace
	delete_all_shape: ShortKeyValue // Delete all shapes, default ctrl/command + backspace

	move_mode: ShortKeyValue // Enter move mode, default space

	draw_dot: ShortKeyValue // Draw dot, default alt/option + 1
	draw_line: ShortKeyValue // Draw line, default alt/option + 2
	draw_pathline: ShortKeyValue // Draw path, default alt/option + 3
	draw_polyline: ShortKeyValue // Draw polyline, default alt/option + 4
	draw_rect: ShortKeyValue // Draw rectangle, default alt/option + 5
	draw_circle: ShortKeyValue // Draw circle, default alt/option + 6
	draw_polygon: ShortKeyValue // Draw polygon, default alt/option + 7

	drawing_delete_point: ShortKeyValue // Delete point during drawing, default backspace
	end_drawing: ShortKeyValue // End drawing, default esc
	confirm_draw: ShortKeyValue // Confirm drawing, default enter

	undo: ShortKeyValue // Undo, default ctrl/command + z
	redo: ShortKeyValue // Redo, default ctrl/command + y

	multiple_select_mode: ShortKeyValue // Multiple selection mode, only supports cmd | command | ctrl | shift, default ctrl/command + click
}

export type ShortcutPluginOptions = {
	autoActive: boolean // Whether to automatically activate the shortcut scope, default is true
	keyMap: ShortcutKeyMap
}
```

## constructor

```ts
// Create ShortcutPlugin instance
constructor(
  imageMarkInstance: ImageMark,
  options?: DeepPartial<ShortcutPluginOptions>
): ShortcutPlugin
```

## Static Properties

### pluginName

`shortcut`

## Instance Methods

### onContainerMouseDown

```ts
// Handle container mousedown event to activate shortcut scope
onContainerMouseDown(event: MouseEvent): void
```

### bindEvent

```ts
// Bind plugin events
bindEvent(): void
```

### unbindEvent

```ts
// Unbind plugin events
unbindEvent(): void
```

### getScopeName

```ts
// Get the scope name for hotkeys
getScopeName(): string
```

### activeScope

```ts
// Activate the hotkey scope
activeScope(): void
```

### eventCaller

```ts
// Call the corresponding handler for a specific key event
eventCaller(keyName: keyof ShortcutKeyMap, event: KeyboardEvent): void
```

### bindKeyMap

```ts
// Bind keyboard shortcuts based on key map configuration
bindKeyMap(options?: DeepPartial<ShortcutPluginOptions>): void
```

### unbindKeyMap

```ts
// Unbind all keyboard shortcuts
unbindKeyMap(): void
```

### getOptions

```ts
// Get merged plugin options
getShorcutPluginOptions(options?: DeepPartial<ShortcutPluginOptions>): ShortcutPluginOptions
```

### destroy

```ts
// Destroy the plugin and clean up resources
destroy(): void
```
