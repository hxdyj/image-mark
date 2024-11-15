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
						}
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
				const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
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

	return (
		<div className="page-shape-plugin-demo bg-[#e5e6eb] ">
			<div className="operate-bar">
				<Space size={'large'} wrap>
					<OperateGroup desc="Draw Rect Programmatically">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
								if (!shapePlugin) return
								rectData.current = {
									shapeName: 'rect',
									x: 0,
									y: 0,
									width: 100,
									height: 200,
								}
								const rectInstance = new ImageMarkRect(rectData.current, imgMark.current!, {})
								shapePlugin.startDrawing(rectInstance)
							}}>Start</Button>
							<Button onClick={() => {
								const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
								if (!shapePlugin || !rectData.current) return
								rectData.current.width += 10
								rectData.current.height += 10
								shapePlugin.drawing(rectData.current)
							}}>Drawing</Button>
							<Button onClick={() => {
								const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
								if (!shapePlugin) return
								shapePlugin.endDrawing()
								rectData.current = null
							}}>End</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Draw Rect Mouse Event">
						<Button.Group>
							<Button onClick={() => {
								const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
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
								const shapePlugin = imgMark.current?.plugin[ShapePlugin.pluginName] as ShapePlugin
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
