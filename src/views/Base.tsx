import ImageMark, { ArrayPoint } from "#/index"
import { Button, Space } from "@arco-design/web-react"
import { useEffect, useRef } from "react"

export function Base() {
	const moveSuccessive = useRef<ArrayPoint>([0, 0])
	let imgMark = useRef<InstanceType<typeof ImageMark> | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/2.png',
			moveConfig: {},
			initScaleConfig: {
				startPosition: 'center',
				size: 'fit',
				// to: 'box',
				// box: {
				// 	x: 1270,
				// 	y: 626,
				// 	width: 20,
				// 	height: 20,
				// },
				// box: {
				// 	x: 50,
				// 	y: 50,
				// 	width: 100,
				// 	height: 100,
				// },
				// padding: 50,
				paddingUnit: 'px'
			}
		}).on('first_render', () => {
			// imgMark?.setMinScale('cover')
			// imgMark?.removeStageLmbDownMoveing()
		}).on('scale', (scale: number) => {
			console.log(scale);
		})
	}, [])

	function onMoveSuccessive() {
		imgMark.current?.moveSuccessive(moveSuccessive.current)
	}

	return (
		<div className="page-base">
			<div className="operate-panel h-[fit] py-[16px]">
				<Space size={'large'}>
					<Button.Group>
						<Button onClick={() => {
							imgMark.current?.move([50, 0])
						}}>x+</Button>
						<Button onClick={() => {
							imgMark.current?.move([-50, 0])
						}}>x-</Button>
						<Button onClick={() => {
							imgMark.current?.move([0, 50])
						}}>y+</Button>
						<Button onClick={() => {
							imgMark.current?.move([0, -50])
						}}>y-</Button>
					</Button.Group>
					<Button.Group>
						<Button onClick={() => {
							moveSuccessive.current = [0, 0]
							imgMark.current?.removeStageLmbDownMoveing()
							imgMark.current?.startSuccessiveMove([0, 0])
						}}>Move Start</Button>
						<Button onClick={() => {
							moveSuccessive.current[0] += 50
							onMoveSuccessive()
						}}>x+</Button>
						<Button onClick={() => {
							moveSuccessive.current[0] -= 50
							onMoveSuccessive()
						}}>x-</Button>
						<Button onClick={() => {
							moveSuccessive.current[1] += 50
							onMoveSuccessive()
						}}>y+</Button>
						<Button onClick={() => {
							moveSuccessive.current[1] -= 50
							onMoveSuccessive()
						}}>y-</Button>
						<Button onClick={() => {
							moveSuccessive.current = [0, 0]
							imgMark.current?.endSuccessiveMove()
							imgMark.current?.addStageLmbDownMoveing()
						}}>Move End</Button>
					</Button.Group>
				</Space>
			</div>
			<div className="container h-[60vh]" ref={containerRef}>
			</div>
			<div className="h-[80vh] bg-[#86909c]"></div>
		</div>
	)
}
