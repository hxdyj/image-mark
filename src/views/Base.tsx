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
			},
		}).on(EventBusEventName.first_render, () => {
			// imgMark?.setMinScale('cover')
			// imgMark?.removeStageLmbDownMoveing()
		}).on(EventBusEventName.scale, (scale: number) => {
			console.log('onScale', scale);
		}).on(EventBusEventName.load_image_error, (e: any) => {
			console.log('loadImageError', e);
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
		<div className="page-base flex">
			<div className="left flex-grow min-w-0 overflow-hidden">
				<div className="h-[20vh] bg-[#86909c]"></div>
				<div className="h-[60vh]" ref={containerRef}>
				</div>
				<div className="h-[20vh] bg-[#86909c]"></div>
			</div>
			<div className="right w-[400px] flex-shrink-0 flex-grow-0 overflow-auto box-border p-4">
				<div className="operate-panel h-[fit] ">
					<Space size={'large'} direction="vertical">
						<OperateGroup desc="Move">
							<Button.Group>
								<Button type="default" onClick={() => {
									imgMark.current?.move([50, 0])
								}}>x+</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.move([-50, 0])
								}}>x-</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.move([0, 50])
								}}>y+</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.move([0, -50])
								}}>y-</Button>

							</Button.Group>
							<Button.Group>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('left')
								}}>left</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('left-top')
								}}>left-top</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('left-bottom')
								}}>left-bottom</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('right')
								}}>right</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('right-top')
								}}>right-top</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('right-bottom')
								}}>right-bottom</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('top')
								}}>top</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('bottom')
								}}>bottom</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.moveTo('center')
								}}>center</Button>
							</Button.Group>
						</OperateGroup>
						<OperateGroup desc="Move Successive: like lmb dragging">
							<Button.Group>
								<Button type="default" onClick={() => {
									moveSuccessive.current = [0, 0]
									imgMark.current?.removeStageLmbDownMoveing()
									imgMark.current?.startSuccessiveMove([0, 0])
								}}>Move Start</Button>
								<Button type="default" onClick={() => {
									moveSuccessive.current[0] += 50
									onMoveSuccessive()
								}}>x+</Button>
								<Button type="default" onClick={() => {
									moveSuccessive.current[0] -= 50
									onMoveSuccessive()
								}}>x-</Button>
								<Button type="default" onClick={() => {
									moveSuccessive.current[1] += 50
									onMoveSuccessive()
								}}>y+</Button>
								<Button type="default" onClick={() => {
									moveSuccessive.current[1] -= 50
									onMoveSuccessive()
								}}>y-</Button>
								<Button type="default" onClick={() => {
									moveSuccessive.current = [0, 0]
									imgMark.current?.endSuccessiveMove()
									imgMark.current?.addStageLmbDownMoveing()
								}}>Move End</Button>
							</Button.Group>
						</OperateGroup>
						<OperateGroup desc="Scale">
							<Button.Group >
								<Button type="default" onClick={() => {
									imgMark.current?.scale(-1, 'center', 'image')
								}}>Img Center-</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.scaleTo({
										to: 'image',
										size: 'cover'
									}, 'center', 'image')
								}}>To Cover</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.scaleTo({
										to: 'image',
										size: 'fit'
									}, 'center', 'image')
								}}>To Fit</Button>
								<Button type="default" onClick={() => {
									imgMark.current?.scaleTo({
										to: 'image',
										size: 'width',
										padding: 0.03,
									}, 'center', 'image')
								}}>To Width（Pad 3%）</Button>
								<Button type="default" onClick={() => {
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
			</div>
		</div>
	)
}
