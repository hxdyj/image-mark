---
layout: doc
footer: false
---

# React Integration Guide

This section covers how to properly integrate mark-img in React projects, including instance management, state synchronization, and common patterns.

## Basic Integration

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

::: warning Note
The `ImageMark` instance should be stored in `useRef`, not `useState`, to avoid unnecessary re-renders.
:::

## Reactive State Synchronization

Sync mark-img state to React:

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
			<div>Scale: {(scale * 100).toFixed(0)}%</div>
			<div>Undoable: {historyInfo.undo} steps</div>
			{isDrawing && <div>Drawing...</div>}
			<div ref={containerRef} style={{ width: '100%', height: '500px' }} />
		</div>
	)
}
```

## Drawing Toolbar

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
				Rect
			</button>
			<button onClick={() => drawShape(ImageMarkCircle, {
				shapeName: 'circle', x: 0, y: 0, r: 0,
			})}>
				Circle
			</button>
			<button onClick={() => drawShape(ImageMarkPolygon, {
				shapeName: 'polygon', points: [],
			})}>
				Polygon
			</button>
		</div>
	)
}
```

## Undo/Redo Buttons

```tsx
function HistoryButtons({ imgMarkRef, historyInfo }) {
	return (
		<div>
			<button
				disabled={historyInfo.undo === 0}
				onClick={() => imgMarkRef.current?.getHistoryPlugin()?.undo()}
			>
				Undo ({historyInfo.undo})
			</button>
			<button
				disabled={historyInfo.redo === 0}
				onClick={() => imgMarkRef.current?.getHistoryPlugin()?.redo()}
			>
				Redo ({historyInfo.redo})
			</button>
		</div>
	)
}
```

## Readonly & Selection Mode

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
				Readonly Mode
			</label>
			<select value={selectMode} onChange={(e) => setSelectMode(e.target.value)}>
				<option value="single">Single</option>
				<option value="multiple">Multiple</option>
			</select>
		</div>
	)
}
```

## Context Menu

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
						<button onClick={handleDelete}>Delete</button>
					)}
					{contextMenu.type === 'container' && (
						<button onClick={() => {
							imgMarkRef.current?.getShapePlugin()?.removeAllNodes()
							setContextMenu(null)
						}}>
							Delete All
						</button>
					)}
				</div>
			)}
		</div>
	)
}
```

## Data Persistence

Combine with localStorage for auto-save and restore:

```tsx
import { debounce } from 'lodash-es'

function ImageAnnotator({ src }) {
	const containerRef = useRef(null)
	const imgMarkRef = useRef(null)

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

## Switching Image Source

When `src` changes, destroy the old instance and create a new one:

```tsx
useEffect(() => {
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
}, [src])  // src as dependency
```

For a complete React integration example, see `src/views/BeautifulPresentation.tsx` in the project source.
