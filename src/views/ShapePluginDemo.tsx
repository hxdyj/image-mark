import { LmbMoveAction } from "#/action/LmbMoveAction"
import './ShapePluginDemo.scss'
import ImageMark from "#/index"
import { ShapePlugin } from "#/plugins/ShapePlugin"
import { ImageMarkRect, RectData } from "#/shape/Rect"
import { useEffect, useRef } from "react"
import { Button, Space } from "@arco-design/web-react"
import { OperateGroup } from "../components/OperateGroup"
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
						}
					]
				}
			}
		}).addPlugin((imageMarkInstance) => {
			const shapePluginInstance = new ShapePlugin(imageMarkInstance)
			shapePluginInstance.addShape(ImageMarkRect, {
				afterRender(shapeInstance) {
					shapeInstance.addAction(LmbMoveAction)
				}
			})
			return shapePluginInstance
		})
		return () => {
			imgMark.current?.destroy()
		}
	})

	const rectData = useRef<RectData | null>(null)

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
