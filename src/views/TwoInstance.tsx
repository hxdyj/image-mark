import ImageMark from "#/index"
import './TwoInstance.scss'
import { useEffect, useRef } from "react"

export function TwoInstance() {

	const imgMark1 = useRef<ImageMark | null>(null)
	const imgMark2 = useRef<ImageMark | null>(null)
	const container1Ref = useRef<HTMLDivElement>(null)
	const container2Ref = useRef<HTMLDivElement>(null)


	useEffect(() => {
		if (!container1Ref.current) throw new Error("container1Ref is null")
		if (!container2Ref.current) throw new Error("container2Ref is null")

		imgMark1.current = new ImageMark({
			el: container1Ref.current,
			src: '/demo-two-instance-1.jpg'
		}).setMinScale(0.0001)

		imgMark2.current = new ImageMark({
			el: container2Ref.current,
			src: '/demo-two-instance-2.jpg'
		}).setMinScale(0.0001)
		return () => {
			imgMark1.current?.destroy()
			imgMark2.current?.destroy()
		}
	}, [])

	return (
		<div className="page-two-instance">
			<div className="h-[10vh] bg-slate-400"></div>
			<div className="h-[70vh] flex gap-x-10">
				<div className="container container1" ref={container1Ref}></div>
				<div className="container container2" ref={container2Ref}></div>
			</div>
			<div className="h-[30vh] bg-slate-400"></div>
		</div>
	)
}
