---
layout: doc
footer: false
---

## 事件

ImageMark 实例可以监听的事件

### init

回调参数：`(imgMark:ImageMark)`

实例初始化完成

### first_render

回调参数：`(imgMark:ImageMark)`

实例第一次渲染完成

### rerender

回调参数：`(imgMark:ImageMark)`

实例重新渲染，除了第一次渲染外触发

### draw

回调参数：`(imgMark:ImageMark)`

每次实例渲染时触发

### resize

回调参数：`(imgMark:ImageMark)`

容器大小改变后触发

### scale

回调参数：`(scale:number,imgMark:ImageMark)`

发生缩放时触发

### container_drag_enter

回调参数：`(imgMark:ImageMark)`

drag enter 时触发

### container_drag_over

回调参数：`(imgMark:ImageMark)`

drag over 时触发

### container_drag_leave

回调参数：`(imgMark:ImageMark)`

drag leave 时触发

### container_drop

回调参数：`(imgMark:ImageMark)`

drag drop 时触发

### shape_add

回调参数：`(data:ShapeData,shapeInstance:ShapeInstance)`

shape 添加时触发，比如通过鼠标绘制添加的 shape

### shape_end_drawing

回调参数：`(isCancelAdd:boolean,shapeInstance:ShapeInstance)`

shape 结束绘制时触发

### shape_after_render

回调参数：`(shapeInstance:ImageMarkShape)`

shape 实例渲染完成时触发

### selection_select_list_change

回调参数：`(selectList:ImageMarkShape[])`

选中插件选中列表改变时触发

### selection_action_click

回调参数：`(shapeInstance:ImageMarkShape)`

选中插件操作按钮点击时触发

### shape_delete_all

回调参数：`(shapeInstance:ImageMarkShape)`

删除所有 shape 时触发

### load_image_error

回调参数： `(event:Event, shapeInstance:ImageMarkShape)`

图片加载失败时触发
