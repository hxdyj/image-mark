---
layout: doc
footer: false
---

# React 集成指南

本节介绍如何在 React 项目中正确集成 mark-img，包括实例管理、状态同步和常见模式。

## 基础集成

```tsx
import { useEffect, useRef } from 'react'
import ImageMark from 'mark-img'
import 'mark-img/dist/style.css'

function ImageAnnotator({ src }) {
	const containerRef = useRef(null)
	const imgMarkRef = useRef(null)

	useEffect(() => {
		imgMarkRef.current = new ImageMark({
			el: containerRef.current,
			src,
			pluginOptions: {
				shape: {
					shapeList: [],
				},
			},
		})

		return () => {
			imgMarkRef.current?.destroy()
		}
	}, [src])

	return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
}
```

::: warning 注意
`ImageMark` 实例应存放在 `useRef` 中而非 `useState`，避免不必要的重新渲染。
:::

## 响应式状态同步

将 mark-img 的状态同步到 React：

```tsx
import { useEffect, useRef, useState } from 'react'
import ImageMark from 'mark-img'

function ImageAnnotator({ src }) {
	const containerRef = useRef(null)
	const imgMarkRef = useRef(null)

	const [scale, setScale] = useState(1)
	const [historyInfo, setHistoryInfo] = useState({ undo: 0, redo: 0 })
	const [isDrawing, setIsDrawing] = useState(false)

	useEffect(() => {
		imgMarkRef.current = new ImageMark({
			el: containerRef.current,
			src,
			pluginOptions: {
				shape: { shapeList: [] },
			},
		})
			.on('scale', (s) => setScale(s))
			.on('history_change', (info) => setHistoryInfo(info))
			.on('shape_start_drawing', () => setIsDrawing(true))
			.on('shape_end_drawing', () => setIsDrawing(false))

		return () => {
			imgMarkRef.current?.destroy()
		}
	}, [src])

	return (
		<div>
			<div>缩放: {(scale * 100).toFixed(0)}%</div>
			<div>可撤销: {historyInfo.undo} 步</div>
			{isDrawing && <div>绘制中...</div>}
			<div ref={containerRef} style={{ width: '100%', height: '500px' }} />
		</div>
	)
}
```

## 绘制工具栏

```tsx
import { ImageMarkRect, ImageMarkCircle, ImageMarkPolygon } from 'mark-img'

function Toolbar({ imgMarkRef }) {
	const drawShape = (ShapeClass, data) => {
		const imgMark = imgMarkRef.current
		if (!imgMark) return
		imgMark.getShapePlugin()?.startDrawing(new ShapeClass(data, imgMark))
	}

	return (
		<div>
			<button onClick={() => drawShape(ImageMarkRect, {
				shapeName: 'rect', x: 0, y: 0, width: 0, height: 0,
			})}>
				矩形
			</button>
			<button onClick={() => drawShape(ImageMarkCircle, {
				shapeName: 'circle', x: 0, y: 0, r: 0,
			})}>
				圆形
			</button>
			<button onClick={() => drawShape(ImageMarkPolygon, {
				shapeName: 'polygon', points: [],
			})}>
				多边形
			</button>
		</div>
	)
}
```

## 撤销/重做按钮

```tsx
function HistoryButtons({ imgMarkRef, historyInfo }) {
	return (
		<div>
			<button
				disabled={historyInfo.undo === 0}
				onClick={() => imgMarkRef.current?.getHistoryPlugin()?.undo()}
			>
				撤销 ({historyInfo.undo})
			</button>
			<button
				disabled={historyInfo.redo === 0}
				onClick={() => imgMarkRef.current?.getHistoryPlugin()?.redo()}
			>
				重做 ({historyInfo.redo})
			</button>
		</div>
	)
}
```

## 只读与选择模式切换

```tsx
function SettingsPanel({ imgMarkRef }) {
	const [readonly, setReadonly] = useState(false)
	const [selectMode, setSelectMode] = useState('single')

	useEffect(() => {
		imgMarkRef.current?.setReadonly(readonly)
	}, [readonly])

	useEffect(() => {
		imgMarkRef.current?.getSelectionPlugin()?.mode(selectMode)
	}, [selectMode])

	return (
		<div>
			<label>
				<input
					type="checkbox"
					checked={readonly}
					onChange={(e) => setReadonly(e.target.checked)}
				/>
				只读模式
			</label>
			<select value={selectMode} onChange={(e) => setSelectMode(e.target.value)}>
				<option value="single">单选</option>
				<option value="multiple">多选</option>
			</select>
		</div>
	)
}
```

## 右键菜单

通过监听事件实现自定义右键菜单：

```tsx
function ImageAnnotator() {
	const imgMarkRef = useRef(null)
	const tmpShapeRef = useRef(null)
	const [contextMenu, setContextMenu] = useState(null)

	useEffect(() => {
		imgMarkRef.current = new ImageMark({ /* ... */ })
			.on('shape_context_menu', (evt, shapeInstance) => {
				evt.preventDefault()
				tmpShapeRef.current = shapeInstance
				setContextMenu({ x: evt.clientX, y: evt.clientY, type: 'shape' })
			})
			.on('container_context_menu', (evt) => {
				evt.preventDefault()
				setContextMenu({ x: evt.clientX, y: evt.clientY, type: 'container' })
			})

		// 点击其他区域关闭菜单
		const hide = () => setContextMenu(null)
		document.addEventListener('click', hide)

		return () => {
			imgMarkRef.current?.destroy()
			document.removeEventListener('click', hide)
		}
	}, [])

	const handleDelete = () => {
		if (tmpShapeRef.current) {
			imgMarkRef.current?.getShapePlugin()?.removeNode(tmpShapeRef.current)
		}
		setContextMenu(null)
	}

	return (
		<div>
			<div ref={containerRef} style={{ width: '100%', height: '500px' }} />
			{contextMenu && (
				<div style={{
					position: 'fixed',
					left: contextMenu.x,
					top: contextMenu.y,
				}}>
					{contextMenu.type === 'shape' && (
						<>
							<button onClick={handleDelete}>删除</button>
						</>
					)}
					{contextMenu.type === 'container' && (
						<button onClick={() => {
							imgMarkRef.current?.getShapePlugin()?.removeAllNodes()
							setContextMenu(null)
						}}>
							删除全部
						</button>
					)}
				</div>
			)}
		</div>
	)
}
```

## 数据持久化

结合 localStorage 实现数据自动保存和恢复：

```tsx
import { debounce } from 'lodash-es'

function ImageAnnotator({ src }) {
	const containerRef = useRef(null)
	const imgMarkRef = useRef(null)

	// 从 localStorage 恢复数据
	const initData = JSON.parse(localStorage.getItem('shapeList') || '[]')

	useEffect(() => {
		const autoSave = debounce(() => {
			const data = imgMarkRef.current?.getShapePlugin()?.data || []
			localStorage.setItem('shapeList', JSON.stringify(data))
		}, 300)

		imgMarkRef.current = new ImageMark({
			el: containerRef.current,
			src,
			pluginOptions: {
				shape: { shapeList: initData },
			},
		}).on('shape_plugin_data_change', autoSave)

		return () => {
			imgMarkRef.current?.destroy()
		}
	}, [src])

	return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
}
```

## 图片源切换

当图片 `src` 变化时，需要销毁旧实例并创建新实例：

```tsx
useEffect(() => {
	// src 变化时，会销毁旧实例并创建新实例
	imgMarkRef.current = new ImageMark({
		el: containerRef.current,
		src,
		pluginOptions: {
			shape: { shapeList: [] },
		},
	})

	return () => {
		imgMarkRef.current?.destroy()
	}
}, [src])  // 将 src 作为依赖项
```

完整的 React 集成示例可以参考项目源码中的 `src/views/BeautifulPresentation.tsx`。
