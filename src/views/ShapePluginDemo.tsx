import ImageMark from "#/index"
import { ShapePlugin } from "#/plugins/ShapePlugin"
import { ImageMarkRect } from "#/shape/Rect"
import { useEffect, useRef } from "react"
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
			const shapeInstance = new ShapePlugin(imageMarkInstance)
			shapeInstance.addShape(ImageMarkRect)
			return shapeInstance
		})
		return () => {
			imgMark.current?.destroy()
		}
	})
	return (
		<div className="page-shape-plugin-demo h-[100vh] bg-[#e5e6eb] ">
			<div ref={containerRef} className="shape-container h-full"></div>
		</div>
	)
}
