import { Button } from "@arco-design/web-react"
import { G, Image, Point, Rect, SVG, Svg } from "@svgdotjs/svg.js"
import { useEffect, useRef, useState } from "react"

export function SvgPointDemo() {

	let svgRef = useRef<Svg | null>(null)
	let imageRef = useRef<Image | null>(null)
	let [point, setPoint] = useState<Point | undefined>(undefined)
	let [imagePoint, setImagePoint] = useState<Point | undefined>(undefined)

	function onMouseOver(e: MouseEvent) {
		setPoint(svgRef.current?.point(e.clientX, e.clientY))
		setImagePoint(imageRef.current?.point(e.clientX, e.clientY))
	}

	const groupRef = useRef<G | null>(null)

	useEffect(() => {
		if (svgRef.current) return
		svgRef.current = SVG()
		//@ts-ignore
		svgRef.current.size(890, 724).css({ 'background-color': '#165DFF' })
		svgRef.current.addTo('.svg-container')

		groupRef.current = new G()
		imageRef.current = new Image()
		imageRef.current.load('/img/demo-parking.jpg')
		imageRef.current.size(3891, 2916)
		groupRef.current.add(imageRef.current)
		groupRef.current.transform({
			scale: 0.16448,
			origin: [0, 0],
			translate: [250, 250]
		})

		const testGroup = new G()
		const testRect = new Rect()
		testRect.size(100, 50)
		testGroup.add(testRect)
		testGroup.addClass('.test-group')
		testGroup.transform({
			origin: [100, 100]
		})
		svgRef.current?.add(testGroup)

		svgRef.current?.add(groupRef.current)
	}, [])

	return (
		/* @ts-ignore */
		<div className="page-svg-point-demo" onMouseMove={onMouseOver}>
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
			<div className="h-[100px] bg-gray-500 p-8">
				<Button onClick={() => {
					groupRef.current?.remove()
				}}>Remove Group</Button>
			</div>
		</div >
	)
}
