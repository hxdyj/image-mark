import { G, Image, Point, SVG, Svg } from "@svgdotjs/svg.js"
import { useEffect, useRef, useState } from "react"

export function SvgDemo() {

	let svgRef = useRef<Svg | null>(null)
	let imageRef = useRef<Image | null>(null)
	let [point, setPoint] = useState<Point | undefined>(undefined)
	let [imagePoint, setImagePoint] = useState<Point | undefined>(undefined)

	function onMouseOver(e: MouseEvent) {
		setPoint(svgRef.current?.point(e.clientX, e.clientY))
		setImagePoint(imageRef.current?.point(e.clientX, e.clientY))
	}

	useEffect(() => {
		if (svgRef.current) return
		svgRef.current = SVG()
		svgRef.current.size(890, 724).css({ 'background-color': '#165DFF' })
		svgRef.current.addTo('.svg-container')

		const g = new G()
		imageRef.current = new Image()
		imageRef.current.load('/demo-map.jpg')
		imageRef.current.size(1280, 948)
		g.add(imageRef.current)
		g.transform({
			scale: 0.5,
			origin: [0, 0],
			translate: [250, 250]
		})

		svgRef.current?.add(g)
	}, [])

	return (
		/* @ts-ignore */
		<div className="page-svg-demo" onMouseMove={onMouseOver}>
			<div className="h-[70vh] bg-gray-500">
			</div>
			<div className="flex fixed right-0 top-0 bg-black p-4 rounded-md rounded-r-none rounded-tl-none text-white w-[300px] justify-center flex-col gap-y-2">
				<div>
					Svg Point <span className="ml-8">{point?.x.toFixed(2)} {point?.y.toFixed(2)}</span>
				</div>
				<div>
					Image Point <span className="ml-4"> {imagePoint?.x.toFixed(2)} {imagePoint?.y.toFixed(2)}</span>
				</div>
			</div>
			<div className="bg-[#94BFFF]">
				<div className="svg-container w-[890px] h-[724px]">

				</div>
			</div>
			<div className="h-[100px] bg-gray-500"></div>
		</div >
	)
}
