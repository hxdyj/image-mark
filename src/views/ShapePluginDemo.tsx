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
export function ShapePluginDemo() {
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/demo-parking.jpg',
			pluginOptions: {
				[ShapePlugin.pluginName]: {
					shapeList: [
						{
							shapeName: 'rect',
							x: 200,
							y: 200,
							width: 100,
							height: 200,
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
							x: 0,
							y: 0,
							r: 50
						},
						{
							shapeName: 'line',
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
					]
				}
			}
		}).addPlugin((imageMarkInstance) => {
			const shapePluginInstance = new ShapePlugin(imageMarkInstance)
			shapePluginInstance
				.addShape(ImageMarkRect, {
					afterRender(shapeInstance) {
						shapeInstance.addAction(LmbMoveAction)
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
			return shapePluginInstance
		})
		return () => {
			imgMark.current?.destroy()
		}
	}, [])

	const rectData = useRef<RectData | null>(null)

	const [disableShapeLmbActionWhileSpaceKeyDown, setDisableShapeLmbActionWhileSpaceKeyDown] = useState(false)


	useEffect(() => {
		if (disableShapeLmbActionWhileSpaceKeyDown) {
			hotkeys('space', { keyup: true }, (event) => {
				event.preventDefault()
				const shapePlugin = getShapePlugin()
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
			hotkeys.unbind('space')
		}
	}, [disableShapeLmbActionWhileSpaceKeyDown])

	function getShapePlugin(): ShapePlugin | null {
		return imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
	}

	return (
		<div className="page-shape-plugin-demo bg-[#e5e6eb] ">
			<div className="operate-bar">
				<Space size={'large'} wrap>
					<OperateGroup desc="Draw Rect Programmatically">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
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
								const shapePlugin = getShapePlugin()
								if (!shapePlugin || !rectData.current) return
								rectData.current.width += 10
								rectData.current.height += 10
								shapePlugin.drawing(rectData.current)
							}}>Drawing</Button>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
								if (!shapePlugin) return
								shapePlugin.endDrawing()
								rectData.current = null
							}}>End</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Draw Rect Mouse Event">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
								if (!shapePlugin) return
								rectData.current = {
									shapeName: 'rect',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
								}
								const rectInstance = new ImageMarkRect(rectData.current, imgMark.current!, {})
								shapePlugin.startDrawing(rectInstance)
							}}>
								Rect
							</Button>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
								if (!shapePlugin) return
								const starImageData: ImgData = {
									shapeName: 'image',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
									src: '/sea.jpg'
								}
								const imgInstance = new ImageMarkImage(starImageData, imgMark.current!, {})
								shapePlugin.startDrawing(imgInstance)
							}}>
								Image
							</Button>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
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
								const shapePlugin = getShapePlugin()
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
								const shapePlugin = getShapePlugin()
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
								const shapePlugin = getShapePlugin()
								if (!shapePlugin) return
								shapePlugin.endDrawing()
							}}>
								PolyLine End
							</Button>
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
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
							<Button onClick={() => {
								const shapePlugin = getShapePlugin()
								if (!shapePlugin) return
								shapePlugin.endDrawing()
							}}>
								Polygon End
							</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Disable Shape LmbAction While Space KeyDown">
						<Switch checked={disableShapeLmbActionWhileSpaceKeyDown} onKeyDown={e => e.preventDefault()} onChange={(checked) => {
							setDisableShapeLmbActionWhileSpaceKeyDown(checked)
						}}></Switch>
					</OperateGroup>
				</Space>
			</div>
			<div className="image-mark-container">
				<div ref={containerRef} className="shape-container h-full"></div>
			</div>
		</div>
	)
}
