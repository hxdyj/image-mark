---
layout: doc
footer: false
---

## Events

Events that an ImageMark instance can listen to

### init

Callback parameters: `(imgMark:ImageMark)`

Triggered when the instance initialization is complete

### first_render

Callback parameters: `(imgMark:ImageMark)`

Triggered when the instance first rendering is complete

### rerender

Callback parameters: `(imgMark:ImageMark)`

Triggered when the instance re-renders, except for the first rendering

### draw

Callback parameters: `(imgMark:ImageMark)`

Triggered every time the instance renders

### resize

Callback parameters: `(imgMark:ImageMark)`

Triggered after the container size changes

### scale

Callback parameters: `(scale:number,imgMark:ImageMark)`

Triggered when scaling occurs

### container_drag_enter

Callback parameters: `(imgMark:ImageMark)`

Triggered when drag enter occurs

### container_drag_over

Callback parameters: `(imgMark:ImageMark)`

Triggered when drag over occurs

### container_drag_leave

Callback parameters: `(imgMark:ImageMark)`

Triggered when drag leave occurs

### container_drop

Callback parameters: `(imgMark:ImageMark)`

Triggered when drag drop occurs

### shape_add

Callback parameters: `(data:ShapeData,shapeInstance:ShapeInstance)`

Triggered when a shape is added, such as a shape added by mouse drawing

### shape_end_drawing

Callback parameters: `(isCancelAdd:boolean,shapeInstance:ShapeInstance)`

Triggered when a shape end drawing

### shape_after_render

Callback parameters: `(shapeInstance:ImageMarkShape)`

Triggered when the shape instance rendering is complete

### selection_select_list_change

Callback parameters: `(selectList:ImageMarkShape[])`

Triggered when the selection plugin's selected list changes

### selection_action_click

Callback parameters: `(shapeInstance:ImageMarkShape)`

Triggered when the selection plugin's action button is clicked

### shape_delete_all

Callback parameters: `(shapeInstance:ImageMarkShape)`

Triggered when all shapes are deleted

### load_image_error

Callback parameters: `(event:Event, shapeInstance:ImageMarkShape)`

Triggered when the image loading fails
