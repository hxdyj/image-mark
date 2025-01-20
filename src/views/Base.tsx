import ImageMark, { ArrayPoint } from "#/index"
import { Button, Space } from "@arco-design/web-react"
import { useEffect, useRef } from "react"
import { OperateGroup } from "../components/OperateGroup"
import { EventBusEventName } from "#/event/const"

export function Base() {
	const moveSuccessive = useRef<ArrayPoint>([0, 0])
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")
		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/img/demo-base.jpg',
			moveConfig: {},
			initScaleConfig: {
				startPosition: 'center',
				size: 'fit',
				padding: 20,
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
		}).on(EventBusEventName.first_render, () => {
			// imgMark?.setMinScale('cover')
			// imgMark?.removeStageLmbDownMoveing()
		}).on(EventBusEventName.scale, (scale: number) => {
			console.log('onScale', scale);
		})
			.setMaxScale(100000)
			.setMinScale(0.01)

		return () => {
			imgMark.current?.destroy()
		}
	}, [])

	function onMoveSuccessive() {
		imgMark.current?.moveSuccessive(moveSuccessive.current)
	}

	return (
		<div className="page-base">
			<div className="operate-panel h-[fit] py-[16px]">
				<Space size={'large'} wrap>
					<OperateGroup desc="Move">
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
							<Button onClick={() => {
								imgMark.current?.moveTo('left')
							}}>left</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('left-top')
							}}>left-top</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('left-bottom')
							}}>left-bottom</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('right')
							}}>right</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('right-top')
							}}>right-top</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('right-bottom')
							}}>right-bottom</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('top')
							}}>top</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('bottom')
							}}>bottom</Button>
							<Button onClick={() => {
								imgMark.current?.moveTo('center')
							}}>center</Button>
						</Button.Group>
					</OperateGroup>
					<OperateGroup desc="Move Successive: like lmb dragging">
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
					</OperateGroup>
					<OperateGroup desc="Scale">
						<Button.Group >
							<Button onClick={() => {
								imgMark.current?.scale(-1, 'center', 'image')
							}}>Img Center-</Button>
							<Button onClick={() => {
								imgMark.current?.scaleTo({
									to: 'image',
									size: 'cover'
								}, 'center', 'image')
							}}>To Cover</Button>
							<Button onClick={() => {
								imgMark.current?.scaleTo({
									to: 'image',
									size: 'fit'
								}, 'center', 'image')
							}}>To Fit</Button>
							<Button onClick={() => {
								imgMark.current?.scaleTo({
									to: 'image',
									size: 'width',
									padding: 0.03,
								}, 'center', 'image')
							}}>To Width（Pad 3%）</Button>
							<Button onClick={() => {
								imgMark.current?.scaleTo({
									to: 'box',
									size: 'cover',
									padding: 30,
									paddingUnit: 'px',
									box: {
										x: 0,
										y: 0,
										width: 500,
										height: 500,
									}
								}, 'left-top', 'image')
							}}>To Box Cover（Pad 30px）</Button>
						</Button.Group>

					</OperateGroup>
				</Space>
			</div>
			<div className="h-[60vh]" ref={containerRef}>
			</div>
			<div className="h-[80vh] bg-[#86909c]"></div>
		</div>
	)
}
