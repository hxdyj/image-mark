---
layout: doc
footer: false
---

# 视图控制

mark-img 提供了丰富的视图控制能力，包括缩放、平移、只读模式和选择模式。

## 缩放

### 鼠标滚轮缩放

默认支持鼠标滚轮缩放画布，无需额外配置。

### 编程式缩放

```ts
// 放大（+1 放大，-1 缩小）
imgMark.scale(+1, 'center', 'image')
imgMark.scale(-1, 'center', 'image')

// 获取当前缩放比例
const currentScale = imgMark.getCurrentScale()

// 缩放到指定配置
imgMark.scaleTo(imgMark.options.initScaleConfig, 'center', 'image')
```

### 设置缩放限制

```ts
// 设置最小缩放
imgMark.setMinScale(0.1)

// 设置最大缩放
imgMark.setMaxScale(10)

// 也可以用预设值：'fit' | 'original' | 'width' | 'height' | 'cover'
imgMark.setMinScale('fit')
```

### 监听缩放事件

```ts
imgMark.on('scale', (scale) => {
	console.log('当前缩放', (scale * 100).toFixed(0) + '%')
})
```

更多缩放相关 API 见 [构造函数方法](/api/constructor-methods#scale)。

## 平移

### 鼠标拖拽平移

默认支持按住鼠标左键拖动画布。绘制过程中按住 `Space` 可临时切换到平移模式。

### 编程式平移

```ts
// 移动到预设位置
imgMark.moveTo('center')
imgMark.moveTo('left-top')

// 移动到指定坐标
imgMark.move([100, 200])
```

### 重置位置和缩放

```ts
imgMark.scaleTo(imgMark.options.initScaleConfig, 'center', 'image')
imgMark.moveTo('center')
```

## 禁用交互

```ts
// 禁用/启用拖动
imgMark.setInteractiveMove(false)
imgMark.setInteractiveMove(true)

// 禁用/启用缩放
imgMark.setInteractiveScale(false)
imgMark.setInteractiveScale(true)
```

## 只读模式

只读模式下，用户无法绘制、编辑或移动图形：

```ts
// 设置只读
imgMark.setReadonly(true)

// 取消只读
imgMark.setReadonly(false)
```

### 监听只读变化

```ts
imgMark.on('readonly_change', (readonly) => {
	console.log('只读模式', readonly ? '开启' : '关闭')
})
```

## 选择模式

通过 [Selection Plugin](/api/plugin/selection) 控制单选/多选：

```ts
const selectionPlugin = imgMark.getSelectionPlugin()

// 切换为单选模式
selectionPlugin?.mode('single')

// 切换为多选模式
selectionPlugin?.mode('multiple')
```

多选模式下，按住 `Ctrl/Command` 点击可选中多个图形。

### 编程式选择

```ts
const selectionPlugin = imgMark.getSelectionPlugin()

// 选中指定图形
selectionPlugin?.selectShape(shapeInstance)

// 批量选中
selectionPlugin?.selectShapes(shapeInstances)

// 取消选中
selectionPlugin?.unselectShape(shapeInstance)

// 清空所有选中
selectionPlugin?.clear()
```

### 监听选中变化

```ts
imgMark.on('selection_select_list_change', (list) => {
	console.log('选中了', list.length, '个图形')
})
```

## 绘制范围限制

控制图形是否能超出图片边界：

```ts
// 禁止所有操作超出图片（绘制、移动、编辑）
imgMark.setEnableShapeOutOfImg(false)

// 也可以分别控制
imgMark.setEnableDrawShapeOutOfImg(false)  // 绘制
imgMark.setEnableMoveShapeOutOfImg(false)  // 移动
imgMark.setEnableEditShapeOutOfImg(false)  // 编辑
```
