import { LmbMoveAction } from "#/action/LmbMoveAction"
import './FullDemo.scss'
import ImageMark from "#/index"
import { ShapePlugin } from "#/plugins/ShapePlugin"
import { ImageMarkRect, RectData } from "#/shape/Rect"
import { useEffect, useRef, useState } from "react"
import { Button, Radio, Space, Switch } from "@arco-design/web-react"
import { OperateGroup } from "../components/OperateGroup"
import hotkeys from "hotkeys-js"
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
			stroke: {
				color: '#FF7D00',
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
	const shapeList = useRef<ShapeData[]>(
		[
			{
				"label": "Rect",
				"shapeName": "rect",
				"x": 1089.5166326265673,
				"y": 1586.7364034872212,
				"width": 228.07664368254427,
				"height": 375.12605868839523
			},
			{
				"label": "Dot",
				"shapeName": "dot",
				"x": 1713.726394284057,
				"y": 1391.6708529692555,
				"r": 10
			},
			{
				"label": "Circle",
				"shapeName": "circle",
				"x": 2223.897834100274,
				"y": 374.3289818063273,
				"r": 195.2732021179132
			},
			{
				"label": "Image",
				"shapeName": "image",
				"x": 2424.965401557255,
				"y": 1805.8100217612446,
				"width": 132.0443726583144,
				"height": 132.0443726583144,
				"src": "/img/hello.png"
			},
			{
				"label": "Line",
				"shapeName": "line",
				"x": 3235.237688324188,
				"y": 1052.556895914946,
				"x2": 1155.5388189557245,
				"y2": 1031.5498366283957
			},
			{
				"label": "PathLine",
				"shapeName": "pathline",
				"points": [
					1737.7344620401138,
					2330.986503924998,
					1734.733453570607,
					2330.986503924998,
					1722.7294196925784,
					2333.9875123945053,
					1686.717318058492,
					2345.991546272534,
					1635.7001740768703,
					2360.99658862007,
					1596.6870639732772,
					2373.0006224980984,
					1563.6759708086986,
					2382.00364790662,
					1533.6658861136268,
					2397.0086902541557,
					1518.6608437660914,
					2403.01070719317,
					1500.6547929490482,
					2415.014741071199,
					1476.646725192991,
					2430.0197834187347,
					1455.6396659064405,
					2451.0268427052847,
					1431.6315981503833,
					2469.0328935223274,
					1410.6245388638333,
					2490.039952808878,
					1395.6194965162974,
					2511.047012095428,
					1389.6174795772833,
					2523.0510459734564,
					1377.6134456992543,
					2550.060122199021,
					1368.610420290733,
					2571.0671814855714,
					1365.6094118212256,
					2595.0752492416286,
					1365.6094118212256,
					2610.0802915891645,
					1365.6094118212256,
					2625.0853339367,
					1365.6094118212256,
					2643.091384753743,
					1371.6114287602402,
					2667.0994525098004,
					1386.616471107776,
					2688.1065117963503,
					1413.6255473333406,
					2718.116596491422,
					1455.6396659064405,
					2760.1307150645225,
					1554.6729454001772,
					2802.144833637623,
					1629.6981571378562,
					2820.1508844546656,
					1698.7213519365212,
					2832.1549183326943,
					1752.7395043876497,
					2835.1559268022015,
					1797.7546314302574,
					2835.1559268022015,
					1845.770766942372,
					2841.157943741216,
					1899.788919393501,
					2841.157943741216,
					1965.8111057226586,
					2835.1559268022015,
					2037.8353089908303,
					2826.15290139368,
					2127.865563076045,
					2796.1428166986084,
					2142.870605423581,
					2787.139791290087,
					2175.8816985881595,
					2766.1327320035366,
					2205.8917832832312,
					2733.121638838958,
					2223.897834100275,
					2712.114579552408,
					2232.900859508796,
					2685.1055033268435,
					2244.9048933868244,
					2658.096427101279,
					2253.9079187953457,
					2625.0853339367,
					2259.9099357343603,
					2595.0752492416286,
					2262.910944203868,
					2565.065164546557,
					2262.910944203868,
					2535.055079851485,
					2262.910944203868,
					2508.0460036259205,
					2253.9079187953457,
					2481.0369274003565,
					2238.90287644781,
					2454.027851174792,
					2211.8938002222458,
					2418.0157495407057,
					2181.883715527174,
					2391.0066733151416,
					2124.864554606538,
					2354.9945716810553,
					2049.8393428688587,
					2321.9834785164767,
					1956.8080803141368,
					2285.971376882391,
					1866.7778262289219,
					2264.9643175958404,
					1779.7485806132142,
					2249.959275248305,
					1722.7294196925784,
					2249.959275248305,
					1689.7183265279994,
					2255.961292187319,
					1659.708241832928,
					2264.9643175958404,
					1602.6890809122917,
					2288.9723853518976,
					1578.6810131562345,
					2297.9754107604194,
					1488.6507590710196,
					2330.986503924998,
					1425.6295812113692,
					2351.9935632115485,
					1377.6134456992543,
					2373.0006224980984,
					1359.6073948822116,
					2379.0026394371125,
					1359.6073948822116,
					2379.0026394371125
				]
			},
			{
				"label": "Polyline",
				"shapeName": "polyline",
				"points": [
					3937.473670188865,
					1241.6204294938975,
					3235.2376883241886,
					1286.635556536505,
					3073.1832309708016,
					2009.8785976877314,
					3901.4615685547788,
					2009.8785976877314
				]
			},
			{
				"label": "Polygon",
				"shapeName": "polygon",
				"points": [
					54.168710646595855,
					146.25233812378295,
					0,
					479.3642782390781,
					150.20098167082506,
					551.3884815072499,
					252.23526963406857,
					866.4943708055021,
					1029.4964632364238,
					857.4913453969805,
					948.4692345597307,
					497.370329056121,
					204.21913412195408,
					509.37436293414964,
					264.2393035120974,
					185.26544822737608
				]
			}
		]
	)
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
	}, [shapeList.current, containerRef.current])

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
								const circleInstance = new ImageMarkCircle(circleData, imgMark.current!, {})
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
								const lineInstance = new ImageMarkPolygon(polygonData, imgMark.current!, {})
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
					<OperateGroup desc="Disable Shape LmbAction While Space KeyDown">
						<Switch className={'w-[40px]'} checked={disableShapeLmbActionWhileSpaceKeyDown} onKeyDown={e => e.preventDefault()} onChange={(checked) => {
							setDisableShapeLmbActionWhileSpaceKeyDown(checked)
						}}></Switch>
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
							}}>Select Triangle</Button>
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
