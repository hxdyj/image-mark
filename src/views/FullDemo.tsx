import { LmbMoveAction } from "#/action/LmbMoveAction"
import './FullDemo.scss'
import ImageMark, { EventBusEventName } from "#/index"
import { ShapePlugin } from "#/plugins/ShapePlugin"
import { ImageMarkRect, RectData } from "#/shape/Rect"
import { useEffect, useRef, useState } from "react"
import { Button, Radio, Space, Switch } from "@arco-design/web-react"
import { OperateGroup } from "../components/OperateGroup"
import { ImageMarkImage, ImageData as ImgData } from "#/shape/Image"
import { CircleData, ImageMarkCircle } from "#/shape/Circle"
import { ImageMarkLine, LineData } from "#/shape/Line"
import { ImageMarkPolyLine, PolyLineData } from "#/shape/PolyLine"
import { ImageMarkPolygon, PolygonData } from "#/shape/Polygon"
import { ImageMarkPathLine, PathLineData } from "#/shape/PathLine"
import { ImageMarkShape, ShapeData, ShapeOptions } from "#/shape/Shape"
// import { SelectionAction } from "#/action/SelectionAction"
import { SelectionPlugin } from "#/plugins/SelectionPlugin"
import { DotData, ImageMarkDot } from "#/shape/Dot"
import { IconRedo, IconUndo } from "@arco-design/web-react/icon"
import { demoData } from "../data/fullDemo.data"
// import ImageMark from '#/index'
// import { ShapePlugin } from '#/plugins/ShapePlugin'
// import { ImageMarkShape } from '#/shape/Shape'
// ImageMark.unuseDefaultPlugin()
// ShapePlugin.unuseDefaultShape()
// ImageMarkShape.unuseDefaultAction()

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
			label: {
				font: {
					fill: 'black'
				}
			},
			auxiliary: {
				stroke: {
					color: '#FADC19',
				}
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

export function FullDemo() {
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const [readonly, setReadonly] = useState(false)
	const [historyStackInfo, setHistoryStackInfo] = useState<{ undo: number, redo: number }>({
		undo: 0,
		redo: 0
	})
	const shapeList = useRef<ShapeData[]>(demoData)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")

		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/img/demo-parking.jpg',
			readonly,
			pluginOptions: {
				[ShapePlugin.pluginName]: {
					shapeList: shapeList.current,
					shapeOptions
				}
			},
		}).on(EventBusEventName.history_change, (info: { undo: number, redo: number }) => {
			setHistoryStackInfo(info)
		}).on(EventBusEventName.shape_context_menu, (evt: MouseEvent, shape: ImageMarkShape) => {
			evt.preventDefault()
			console.log(shape)
		}).on(EventBusEventName.container_context_menu, (evt: MouseEvent, imgMark: ImageMarkShape) => {
			evt.preventDefault()
			console.log(imgMark)
		})
		// .addPlugin((imageMarkInstance) => {
		// 	const shapePluginInstance = new ShapePlugin(imageMarkInstance, {
		// 		setAttr() {
		// 			return {
		// 				stroke: {
		// 					// color: 'green',

		// 				},
		// 				label: {
		// 					font: {
		// 						fill: 'red'
		// 					}
		// 				},
		// 			}
		// 		},
		// 	})
		// 	shapePluginInstance
		// 		.addShape(ImageMarkRect, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 				shapeInstance.addAction(SelectionAction, {
		// 					initDrawFunc(selection: SelectionAction) {
		// 						// const shape = selection.getSelectionShape()
		// 						// shape?.stroke({
		// 						// 	color: '#165DFF'
		// 						// })
		// 					}
		// 				})
		// 			}
		// 		})
		// 		.addShape(ImageMarkImage, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 		.addShape(ImageMarkCircle, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			},
		// 			initDrawFunc(shape: ImageMarkShape) {
		// 				shape.getMainShape().stroke({
		// 					color: 'red'
		// 				})
		// 			}
		// 		})
		// 		.addShape(ImageMarkLine, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 		.addShape(ImageMarkPolyLine, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 		.addShape(ImageMarkPolygon, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 		.addShape(ImageMarkPathLine, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 		.addShape(ImageMarkDot, {
		// 			afterRender(shapeInstance) {
		// 				shapeInstance.addAction(LmbMoveAction)
		// 			}
		// 		})
		// 	return shapePluginInstance
		// })
		// .addPlugin(SelectionPlugin)
		// .addPlugin(imageMarkInstance => {
		// 	const selectionPluginInstance = new SelectionPlugin(imageMarkInstance, {
		// 		selectionActionOptions: {
		// 			setAttr() {
		// 				return {
		// 					stroke: {
		// 						color: 'pink'
		// 					}
		// 				}
		// 			}
		// 		}
		// 	})
		// 	return selectionPluginInstance
		// })
		return () => {
			imgMark.current?.destroy()
		}
	}, [])

	const rectData = useRef<RectData | null>(null)

	function getPlugin<T>(name: string): T | null {
		return imgMark.current?.plugin[name] as T
	}

	return (
		<div className="page-full-demo bg-[#e5e6eb] flex">

			<div className="image-mark-container h-[100vh] flex-grow min-w-0 overflow-hidden">
				<div ref={containerRef} className="shape-container h-full"></div>
			</div>
			<div className="operate-bar  w-[400px] flex-shrink-0 flex-grow-0 overflow-auto box-border p-4 bg-white">
				<Space size={'large'} direction="vertical">

					<OperateGroup desc="Draw Shape Mouse Event">
						<Button.Group>
							<Button type="default" onClick={() => {
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
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const starImageData: ImgData = {
									shapeName: 'image',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
									src: '/img/hello.png'
								}
								const imgInstance = new ImageMarkImage(starImageData, imgMark.current!, {})
								shapePlugin.startDrawing(imgInstance)
							}}>
								Image
							</Button>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const dotData: DotData = {
									shapeName: 'dot',
									x: 0,
									y: 0,
									r: 0
								}
								const dotInstance = new ImageMarkDot(dotData, imgMark.current!, {})
								shapePlugin.startDrawing(dotInstance)
							}}>
								Dot
							</Button>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const circleData: CircleData = {
									shapeName: 'circle',
									x: 0,
									y: 0,
									r: 0
								}
								const circleInstance = new ImageMarkCircle(circleData, imgMark.current!, shapeOptions)
								shapePlugin.startDrawing(circleInstance)
							}}>
								Circle
							</Button>
							<Button type="default" onClick={() => {
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
							<Button type="default" onClick={() => {
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
							<Button type="default" onClick={() => {
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
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const polygonData: PolygonData = {
									shapeName: 'polygon',
									points: []
								}
								const lineInstance = new ImageMarkPolygon(polygonData, imgMark.current!, shapeOptions)
								shapePlugin.startDrawing(lineInstance)
							}}>
								Polygon Start
							</Button>

						</Button.Group>
					</OperateGroup>

					<OperateGroup desc="Draw Rect Programmatically">
						<Button.Group>
							<Button type="default" onClick={() => {
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
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin || !rectData.current) return
								rectData.current.width += 10
								rectData.current.height += 10
								shapePlugin.drawing(rectData.current)
							}}>Drawing</Button>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								shapePlugin.endDrawing()
								rectData.current = null
							}}>End</Button>
						</Button.Group>
					</OperateGroup>

					<OperateGroup desc="History plugin">
						<Space>
							<Button.Group>
								<Button type={historyStackInfo?.undo ? 'primary' : 'default'} onClick={() => {
									const historyPlugin = imgMark?.current?.getHistoryPlugin()
									historyPlugin?.undo()
								}} icon={<IconUndo />} />
								<Button type={historyStackInfo?.redo ? 'primary' : 'default'} onClick={() => {
									const historyPlugin = imgMark?.current?.getHistoryPlugin()
									historyPlugin?.redo()
								}} icon={<IconRedo />} />
							</Button.Group>
							<Button.Group>
								<Button type="default" onClick={() => {
									const historyPlugin = imgMark?.current?.getHistoryPlugin()
									historyPlugin?.clear()
								}}>clear</Button>

							</Button.Group>
						</Space>
						<Button type="default" onClick={() => {
							const historyPlugin = imgMark?.current?.getHistoryPlugin()
							console.log(historyPlugin)
						}}>Console History Plugin</Button>
					</OperateGroup>
					<OperateGroup desc="Selection plugin">
						<Button.Group>
							<Button type="default" onClick={() => {
								const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
								if (plugin) plugin.destroy()
							}}>Remove Selection Plugin</Button>
							<Button type="default" onClick={() => {
								imgMark.current?.addPlugin(SelectionPlugin)
							}}>Add Selection Plugin</Button>
						</Button.Group>

						<Radio.Group defaultValue={'single'} type="button" onChange={value => {
							const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
							plugin?.mode(value)
						}}>
							<Radio value="single">Single</Radio>
							<Radio value="multiple">Multiple</Radio>
						</Radio.Group>

						<Button.Group>
							<Button type="default" onClick={() => {
								const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
								if (!plugin) return
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								plugin.onSelectionActionClick(shapePlugin?.getInstanceByData(shapeList.current[6])!)
							}}>Select Polyline</Button>
							<Button type="default" onClick={() => {
								const plugin = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)
								plugin?.clear()
							}}>Clear All Select</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Readonly">
						<Switch className={'w-[40px]'} checked={readonly} onKeyDown={e => e.preventDefault()} onChange={(checked) => {
							setReadonly(checked)
							imgMark.current?.setReadonly(checked)
						}}></Switch>
					</OperateGroup>

					<OperateGroup desc="Data Operate">
						<Button.Group>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								console.log(shapePlugin.data)
							}}>Console Shape Data List</Button>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								const selectedShapes = getPlugin<SelectionPlugin>(SelectionPlugin.pluginName)?.selectShapeList || []
								if (selectedShapes.length) {
									shapePlugin.removeNodes(selectedShapes)
								}
							}}>Delete Selected Shape</Button>
							<Button type="default" onClick={() => {
								const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
								if (!shapePlugin) return
								shapePlugin.setData([
									{
										shapeName: 'polygon',
										points: [1000, 1000, 1400, 1400, 1000, 1400]
									},
								])
							}}>Set Data</Button>
							{/* <Button type="default" onClick={() => {
							const shapePlugin = getPlugin<ShapePlugin>(ShapePlugin.pluginName)
							if (!shapePlugin) return
							const rectData = shapeList.current[0]
							if (!rectData) return
							const rectInstance = shapePlugin.getInstanceByData(rectData)
							if (!rectInstance) return
							rectInstance.rotate(45)
						}}>Rotate Rect</Button> */}
						</Button.Group>
					</OperateGroup>
				</Space>
			</div>
		</div>
	)
}
