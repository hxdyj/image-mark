import { LmbMoveAction } from "#/action/LmbMoveAction"
import './ShapePluginDemo.scss'
import ImageMark from "#/index"
import { ShapePlugin } from "#/plugins/ShapePlugin"
import { ImageMarkRect, RectData } from "#/shape/Rect"
import { useEffect, useRef, useState } from "react"
import { Button, Space, Switch } from "@arco-design/web-react"
import { OperateGroup } from "../components/OperateGroup"
import hotkeys from "hotkeys-js"
import { ImageMarkImage, ImageData as ImgData } from "#/shape/Image"
import { CircleData, ImageMarkCircle } from "#/shape/Circle"
import { ImageMarkLine, LineData } from "#/shape/Line"
import { ImageMarkPolyLine, PolyLineData } from "#/shape/PolyLine"
import { ImageMarkPolygon, PolygonData } from "#/shape/Polygon"
import { ImageMarkPathLine, PathLineData } from "#/shape/PathLine"
import { ImageMarkShape, ShapeData, ShapeOptions } from "#/shape/Shape"
import { SelectionAction } from "#/action/SelectionAction"
import { SelectionPlugin } from "#/plugins/SelectionPlugin"
// ShapePlugin.useDefaultShape()
// ImageMarkShape.useAction(LmbMoveAction)
// ImageMark.usePlugin(ShapePlugin)
// ImageMarkShape.useAction(SelectionAction, {
// 	initDrawFunc(selection: SelectionAction) {
// 		const shape = selection.getSelectionShape()
// 		shape?.stroke('blue')
// 	}
// })
// ImageMark.usePlugin(SelectionPlugin)

const shapeOptions: ShapeOptions = {
	setAttr(shapeInstance: ImageMarkShape) {
		return {
			stroke: {
				color: 'green',
			}
		}
	},
	initDrawFunc(shape: ImageMarkShape) {
		// const ele = shape.getMainShape()
		// ele.stroke({
		// 	color: 'red'
		// })
	}
}

export function ShapePluginDemo() {
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const shapeList = useRef<ShapeData[]>([
		{
			shapeName: 'rect',
			width: 100,
			height: 200,
			x: 100,
			y: 100,
			label: '#1',
			transform: {
				matrix: {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: 0,
					f: 0,
				}
			},
		},
		{
			shapeName: 'circle',
			transform: {
				matrix: {
					a: 1,
					b: 0,
					c: 0,
					d: 1,
					e: 50,
					f: 100,
				}
			},
			x: 0,
			y: 0,
			r: 5
		},
		{
			shapeName: 'image',
			x: 600,
			y: 600,
			width: 200,
			height: 200,
			src: '/star.svg'
		},
		{
			shapeName: 'circle',
			transform: {
				matrix: {
					a: 0.5,
					b: 0,
					c: 0,
					d: 0.5,
					e: 0,
					f: 0,
				}
			},
			r: 50,
			x: 300,
			y: 300
		},
		{
			shapeName: 'line',
			label: '#2',
			x: 500,
			y: 500,
			x2: 600,
			y2: 600
		},
		{
			shapeName: 'polyline',
			points: [800, 800, 850, 850, 800, 900]
		},
		{
			shapeName: 'polygon',
			points: [1000, 1000, 1400, 1400, 1000, 1400]
		},
	])
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")

		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/img/demo-parking.jpg',
			pluginOptions: {
				[ShapePlugin.pluginName]: {
					shapeList: shapeList.current,
					shapeOptions
				}
			}
		})
			.addPlugin((imageMarkInstance) => {
				const shapePluginInstance = new ShapePlugin(imageMarkInstance, {
					setAttr() {
						return {
							stroke: {
								color: 'green'
							},
							label: {
								font: {
									fill: 'black'
								}
							}
						}
					},
				})
				shapePluginInstance
					.addShape(ImageMarkRect, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
							shapeInstance.addAction(SelectionAction, {
								initDrawFunc(selection: SelectionAction) {
									// const shape = selection.getSelectionShape()
									// shape?.stroke({
									// 	color: '#165DFF'
									// })
								}
							})
						}
					})
					.addShape(ImageMarkImage, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						}
					})
					.addShape(ImageMarkCircle, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						},
						initDrawFunc(shape: ImageMarkShape) {
							shape.getMainShape().stroke({
								color: 'red'
							})
						}
					})
					.addShape(ImageMarkLine, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						}
					})
					.addShape(ImageMarkPolyLine, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						}
					})
					.addShape(ImageMarkPolygon, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						}
					})
					.addShape(ImageMarkPathLine, {
						afterRender(shapeInstance) {
							shapeInstance.addAction(LmbMoveAction)
						}
					})
				return shapePluginInstance
			})
			// .addPlugin(SelectionPlugin)
			.addPlugin(imageMarkInstance => {
				const selectionPluginInstance = new SelectionPlugin(imageMarkInstance, {
					selectionActionOptions: {
						setAttr() {
							return {
								stroke: {
									color: 'pink'
								}
							}
						}
					}
				})
				return selectionPluginInstance
			})
		return () => {
			imgMark.current?.destroy()
		}
	}, [])

	const rectData = useRef<RectData | null>(null)

	const [disableShapeLmbActionWhileSpaceKeyDown, setDisableShapeLmbActionWhileSpaceKeyDown] = useState(false)


	useEffect(() => {
		hotkeys('enter', (event) => {
			event.preventDefault()
			if (imgMark.current?.status.drawing) {
				const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
				if (!shapePlugin) return
				shapePlugin.endDrawing()
			}
		})
		hotkeys('esc', (event) => {
			if (imgMark.current?.status.drawing) {
				const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
				if (!shapePlugin) return
				shapePlugin.endDrawing(true)
			}
		})
		hotkeys('backspace', (event) => {
			if (imgMark.current?.status.drawing) {
				const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
				if (!shapePlugin) return
				shapePlugin.dropLastMouseTrace()
			}
		})

		if (disableShapeLmbActionWhileSpaceKeyDown) {
			hotkeys('space', { keyup: true }, (event) => {
				event.preventDefault()
				const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
				if (!shapePlugin) return
				if (event.type === 'keydown') {
					shapePlugin.disableAction(LmbMoveAction.actionName)
				}

				if (event.type === 'keyup') {
					shapePlugin.enableAction(LmbMoveAction.actionName)
				}
			})
		} else {
			hotkeys.unbind('space')
		}
		return () => {
			hotkeys.unbind()
		}
	}, [disableShapeLmbActionWhileSpaceKeyDown])


	function getPlugin<T>(name: string): T | null {
		return imgMark.current?.plugin[name] as T
	}

	return (
		<div className="page-shape-plugin-demo bg-[#e5e6eb] ">
			<div className="operate-bar">
				<Space size={'large'} wrap>
					<OperateGroup desc="Draw Rect Programmatically">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								rectData.current = {
									shapeName: 'rect',
									x: 0,
									y: 0,
									width: 100,
									height: 200,
								}
								const rectInstance = new ImageMarkRect(rectData.current, imgMark.current!, {})
								shapePlugin.startDrawing(rectInstance, true)
							}}>Start</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin || !rectData.current) return
								rectData.current.width += 10
								rectData.current.height += 10
								shapePlugin.drawing(rectData.current)
							}}>Drawing</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								shapePlugin.endDrawing()
								rectData.current = null
							}}>End</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Draw Rect Mouse Event">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								rectData.current = {
									shapeName: 'rect',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
								}
								const rectInstance = new ImageMarkRect(rectData.current, imgMark.current!, shapeOptions)
								shapePlugin.startDrawing(rectInstance)
							}}>
								Rect
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const starImageData: ImgData = {
									shapeName: 'image',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
									src: '/img/sea.jpg'
								}
								const imgInstance = new ImageMarkImage(starImageData, imgMark.current!, {})
								shapePlugin.startDrawing(imgInstance)
							}}>
								Image
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const circleData: CircleData = {
									shapeName: 'circle',
									x: 0,
									y: 0,
									r: 0
								}
								const circleInstance = new ImageMarkCircle(circleData, imgMark.current!, {})
								shapePlugin.startDrawing(circleInstance)
							}}>
								Circle
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const lineData: LineData = {
									shapeName: 'line',
									x: 0,
									y: 0,
									x2: 0,
									y2: 0
								}
								const lineInstance = new ImageMarkLine(lineData, imgMark.current!, {})
								shapePlugin.startDrawing(lineInstance)
							}}>
								Line
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const lineData: PathLineData = {
									shapeName: 'pathline',
									points: []
								}
								const lineInstance = new ImageMarkPathLine(lineData, imgMark.current!, {})
								shapePlugin.startDrawing(lineInstance)
							}}>
								PathLine
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const lineData: PolyLineData = {
									shapeName: 'polyline',
									points: []
								}
								const lineInstance = new ImageMarkPolyLine(lineData, imgMark.current!, {})
								shapePlugin.startDrawing(lineInstance)
							}}>
								PolyLine Start
							</Button>
							<Button onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const polygonData: PolygonData = {
									shapeName: 'polygon',
									points: []
								}
								const lineInstance = new ImageMarkPolygon(polygonData, imgMark.current!, {})
								shapePlugin.startDrawing(lineInstance)
							}}>
								Polygon Start
							</Button>

						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Disable Shape LmbAction While Space KeyDown">
						<Switch checked={disableShapeLmbActionWhileSpaceKeyDown} onKeyDown={e => e.preventDefault()} onChange={(checked) => {
							setDisableShapeLmbActionWhileSpaceKeyDown(checked)
						}}></Switch>
					</OperateGroup>
					<Button.Group>
						<Button onClick={() => {
							const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
							if (!shapePlugin) return
							console.log(shapePlugin.data)
						}}>Console Shape Data List</Button>
						<Button onClick={() => {
							const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
							if (!shapePlugin) return
							shapePlugin.setData([
								{
									shapeName: 'polygon',
									points: [1000, 1000, 1400, 1400, 1000, 1400]
								},
							])
						}}>Set Data</Button>
						{/* <Button onClick={() => {
							const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
							if (!shapePlugin) return
							const rectData = shapeList.current[0]
							if (!rectData) return
							const rectInstance = shapePlugin.getInstanceByData(rectData)
							if (!rectInstance) return
							rectInstance.rotate(45)
						}}>Rotate Rect</Button> */}
					</Button.Group>
					<Button.Group>
						<Button onClick={() => {
							const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
							if (!plugin) return
							plugin.mode('single')
						}}>Selection Single</Button>
						<Button onClick={() => {
							const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
							if (!plugin) return
							plugin.mode('multiple')
						}}>Selection Multiple</Button>
						<Button onClick={() => {
							const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
							if (!plugin) return
							const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
							plugin.onSelectionActionClick(shapePlugin?.getInstanceByData(shapeList.current[6])!)
						}}>Select Triangle</Button>
					</Button.Group>
					<OperateGroup desc="plugin">
						<Button.Group>

							<Button onClick={() => {
								const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
								if (plugin) plugin.destroy()
							}}>Remove Selection Plugin</Button>
							<Button onClick={() => {
								imgMark.current?.addPlugin(SelectionPlugin)
							}}>Add Selection Plugin</Button>
						</Button.Group>
					</OperateGroup>
				</Space>
			</div>
			<div className="image-mark-container">
				<div ref={containerRef} className="shape-container h-full"></div>
			</div>
		</div>
	)
}
