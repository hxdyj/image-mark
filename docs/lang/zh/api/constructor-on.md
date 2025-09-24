---
layout: doc
footer: false
---

## 事件

ImageMark 实例可以监听的事件

### init

```ts
// 实例初始化完成
(imgMark:ImageMark): void
```

### first_render

```ts
// 实例第一次渲染完成
(imgMark:ImageMark): void
```

### rerender

```ts
// 实例重新渲染，除了第一次渲染外触发
(imgMark:ImageMark): void
```

### draw

```ts
// 每次实例渲染时触发
(imgMark:ImageMark): void
```

### resize

```ts
// 容器大小改变后触发
(imgMark:ImageMark): void
```

### scale

```ts
// 发生缩放时触发
(scale:number,imgMark:ImageMark): void
```

### container_drag_enter

```ts
// drag enter 时触发
(imgMark:ImageMark): void
```

### container_drag_over

```ts
// drag over 时触发
(imgMark:ImageMark): void
```

### container_drag_leave

```ts
// drag leave 时触发
(imgMark:ImageMark): void
```

### container_drop

```ts
// drag drop 时触发
(imgMark:ImageMark): void
```

### shape_add

```ts
// shape 添加时触发，比如通过鼠标绘制添加的 shape
(data:ShapeData,shapeInstance:ShapeInstance): void
```

### shape_end_drawing

```ts
// shape 结束绘制时触发
(isCancelAdd:boolean,shapeInstance:ShapeInstance): void
```

### shape_start_move

```ts
// 图形开始移动时触发
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_end_move

```ts
// 图形结束移动时触发
(shapeInstance: ImageMarkShape, [diffX, diffY]: [number, number], imgMark: ImageMark): void
```

### shape_start_edit

```ts
// 图形开始编辑时触发
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_end_edit

```ts
// 图形结束编辑时触发
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_after_render

```ts
// shape 实例渲染完成时触发
(shapeInstance:ImageMarkShape): void
```

### shape_delete

```ts
// 删除单个 shape 时触发
(shapeInstance: ImageMarkShape, imgMark: ImageMark): void
```

### shape_delete_patch

```ts
// 批量删除 shape 时触发
(shapeInstances: ImageMarkShape[], imgMark: ImageMark): void
```

### shape_delete_all

```ts
// 删除所有 shape 时触发
(shapeInstance:ImageMarkShape): void
```

### shape_plugin_set_data

```ts
// Shape 插件设置数据时触发
(data: ShapeData[], imgMark: ImageMark): void
```

### selection_select_list_change

```ts
// 选中插件选中列表改变时触发
(selectList:ImageMarkShape[]): void
```

### selection_action_click

```ts
// 选中插件操作按钮点击时触发
(shapeInstance:ImageMarkShape): void
```

### readonly_change

```ts
// 只读状态改变时触发
(readonly: boolean, imgMark: ImageMark): void
```

### load_image_error

```ts
// 图片加载失败时触发
(event:Event, shapeInstance:ImageMarkShape): void
```

### history_change

```ts
// 历史记录状态改变时触发，如撤销/重做操作后
(info: { undo: number, redo: number }, imgMark: ImageMark): void
```
