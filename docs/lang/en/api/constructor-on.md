---
layout: doc
footer: false
---

## Events

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

### shape_after_render

```ts
// Triggered when the shape instance rendering is complete
(shapeInstance:ImageMarkShape): void
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

### shape_delete_all

```ts
// Triggered when all shapes are deleted
(shapeInstance:ImageMarkShape): void
```

### load_image_error

```ts
// Triggered when the image loading fails
(event:Event, shapeInstance:ImageMarkShape): void
```
