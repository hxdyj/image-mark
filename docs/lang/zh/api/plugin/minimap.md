---
layout: doc
footer: false
---

# Minimap Plugin

小地图插件，在画布角落显示一个缩略图，包含图片和所有图形的概览视图。支持通过点击或拖拽小地图来快速导航画布。

## Types

```typescript
export type MinimapPluginOptions = {
	size?: number;  // minimap 的大小（宽度或高度的最大值），默认 200
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';  // 位置，默认 'bottom-right'
	padding?: number;  // 距离容器边缘的距离，默认 20
	border?: {
		width?: number;  // 边框宽度，默认 2
		color?: string;  // 边框颜色，默认 '#333'
	};
	background?: string;  // 背景色，默认 'rgba(255, 255, 255, 0.9)'
	viewportStyle?: {
		stroke?: string;  // 视口矩形边框颜色，默认 '#FF7D00'
		strokeWidth?: number;  // 视口矩形边框宽度，默认 2
		fill?: string;  // 视口矩形填充颜色，默认 'rgba(255, 125, 0, 0.1)'
	};
	shapeStyle?: {
		fill?: string;  // 图形填充颜色，默认 'rgba(255, 125, 0, 0.3)'
		stroke?: string;  // 图形边框颜色，默认 '#FF7D00'
		strokeWidth?: number;  // 图形边框宽度，默认 1
	};
	opacity?: number;  // minimap 整体透明度，默认 1
	constrainToImage?: boolean;  // 在 minimap 操作时是否限制视口不超出图片范围，默认跟随 imageFullOfContainer
}
```

## constructor

```ts
// 创建 MinimapPlugin 实例
constructor(
  imageMarkInstance: ImageMark,
  pluginOptions?: MinimapPluginOptions
): MinimapPlugin
```

## 静态属性

### pluginName

`minimap`

### pluginOptions

默认配置项：

```typescript
{
	size: 200,
	position: 'bottom-right',
	padding: 20,
	border: {
		width: 2,
		color: '#333'
	},
	background: 'rgba(255, 255, 255, 0.9)',
	viewportStyle: {
		stroke: '#FF7D00',
		strokeWidth: 2,
		fill: 'rgba(255, 125, 0, 0.1)'
	},
	shapeStyle: {
		fill: 'rgba(255, 125, 0, 0.3)',
		stroke: '#FF7D00',
		strokeWidth: 1
	},
	opacity: 1
}
```

## 功能说明

### 缩略图显示

插件会在画布容器的指定角落（通过 `position` 配置）渲染一个缩略图，包含：

- **背景图片**：缩小后的原始图片
- **图形标注**：所有已添加的图形（Rect、Circle、Polygon 等）的简化绘制
- **视口矩形**：橙色半透明矩形，标识当前主画布可见区域

### 交互操作

- **左键点击**：点击小地图任意位置，主画布视口中心会移动到对应的图片位置
- **左键拖拽**：在小地图上按住左键拖拽，可连续移动主画布视口
- **右键菜单**：小地图上的右键菜单事件被阻止，不会冒泡到主画布

### 实时同步

小地图会在以下情况自动更新：

- 主画布移动（平移）
- 主画布缩放
- 图形添加、删除、修改
- 容器尺寸变化（rerender）

## 图形在小地图中的绘制

每个图形类型可以实现 `drawMinimap` 方法来自定义在小地图中的渲染方式。如果图形没有实现此方法，则不会在小地图中显示。

```typescript
// MinimapDrawContext 类型
export type MinimapDrawContext = {
	ctx: CanvasRenderingContext2D;  // Canvas 2D 上下文
	scale: number;  // minimap 相对于原图的缩放比例
	fill?: string;  // 填充颜色
	stroke?: string;  // 边框颜色
	strokeWidth?: number;  // 边框宽度
}

// 在 Shape 类中实现
drawMinimap?(ctx: MinimapDrawContext): void
```

## 使用示例

### 基础用法

```ts
import ImageMark from 'mark-img'

// 使用默认插件（已包含 MinimapPlugin）
ImageMark.useDefaultPlugin()
```

### 自定义配置

```ts
import ImageMark, { MinimapPlugin } from 'mark-img'

ImageMark.usePlugin(MinimapPlugin, {
	size: 300,
	position: 'top-right',
	padding: 10,
	opacity: 0.8,
	viewportStyle: {
		stroke: '#0088ff',
		strokeWidth: 3,
		fill: 'rgba(0, 136, 255, 0.15)'
	}
})
```

## destroy

```ts
// 销毁插件，移除小地图 DOM 元素和所有事件监听
destroy(): void
```
