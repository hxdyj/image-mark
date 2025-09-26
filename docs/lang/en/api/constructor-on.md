---
layout: doc
footer: false
---

## Instance Events

Events that an ImageMark instance can listen to

### init

```ts
// Triggered when the instance initialization is complete
(imgMark:ImageMark): void
```

### first_render

```ts
// Triggered when the instance first rendering is complete
(imgMark:ImageMark): void
```

### rerender

```ts
// Triggered when the instance re-renders, except for the first rendering
(imgMark:ImageMark): void
```

### draw

```ts
// Triggered every time the instance renders
(imgMark:ImageMark): void
```

### resize

```ts
// Triggered after the container size changes
(imgMark:ImageMark): void
```

### scale

```ts
// Triggered when scaling occurs
(scale:number,imgMark:ImageMark): void
```

### container_drag_enter

```ts
// Triggered when drag enter occurs
(imgMark:ImageMark): void
```

### container_drag_over

```ts
// Triggered when drag over occurs
(imgMark:ImageMark): void
```

### container_drag_leave

```ts
// Triggered when drag leave occurs
(imgMark:ImageMark): void
```

### container_drop

```ts
// Triggered when drag drop occurs
(imgMark:ImageMark): void
```

### shape_add

```ts
// Triggered when a shape is added, such as a shape added by mouse drawing
(data:ShapeData,shapeInstance:ShapeInstance): void
```

### shape_end_drawing

```ts
// Triggered when a shape end drawing
(isCancelAdd:boolean,shapeInstance:ShapeInstance): void
```

### shape_start_move

```ts
// Triggered when a shape starts moving
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_end_move

```ts
// Triggered when a shape ends moving
(shapeInstance: ImageMarkShape, [diffX, diffY]: [number, number], imgMark: ImageMark): void
```

### shape_start_edit

```ts
// Triggered when a shape starts editing
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_end_edit

```ts
// Triggered when a shape ends editing
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_after_render

```ts
// Triggered when the shape instance rendering is complete
(shapeInstance:ImageMarkShape): void
```

### shape_delete

```ts
// Triggered when deleting a single shape
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_delete_patch

```ts
// Triggered when deleting shapes in batch
(shapeInstances: ImageMarkShape[], imgMark: ImageMark): void
```

### shape_delete_all

```ts
// Triggered when all shapes are deleted
(shapeInstance:ImageMarkShape): void
```

### shape_plugin_set_data

```ts
// Triggered when the Shape plugin sets data
(data: ShapeData[], imgMark: ImageMark): void
```

### selection_select_list_change

```ts
// Triggered when the selection plugin's selected list changes
(selectList:ImageMarkShape[]): void
```

### selection_action_click

```ts
// Triggered when the selection plugin's action button is clicked
(shapeInstance:ImageMarkShape): void
```

### readonly_change

```ts
// Triggered when the readonly state of the instance changes
(readonly: boolean, imgMark: ImageMark): void
```

### load_image_error

```ts
// Triggered when the image loading fails
(event:Event, shapeInstance:ImageMarkShape): void
```

### history_change

```ts
// Triggered when the history state changes, such as after undo/redo operations
(info: { undo: number, redo: number }, imgMark: ImageMark): void
```

### container_context_menu

```ts
// Triggered when the container context menu is triggered
(event:MouseEvent, imgMark: ImageMark): void
```

### shape_context_menu

```ts
// Triggered when the shape context menu is triggered
(event:MouseEvent, shapeInstance:ImageMarkShape, imgMark: ImageMark): void
```

## Global Events

### shortcut_auto_active

```ts
// Triggered when the shortcut operation automatically activates
(scopeName:string): void
```
