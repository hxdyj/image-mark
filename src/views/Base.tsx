import ImageMark, { ArrayPoint } from "#/index"
import { Button, Space } from "@arco-design/web-react"
import { useEffect, useRef } from "react"
import { OperateGroup } from "../components/OperateGroup"

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
			console.log('onScale', scale);
		})
	}, [])

	function onMoveSuccessive() {
		imgMark.current?.moveSuccessive(moveSuccessive.current)
	}

	return (
		<div className="page-base">
			<div className="operate-panel h-[fit] py-[16px]">
				<Space size={'large'}>
					<OperateGroup desc="移动画布">
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
					<OperateGroup desc="连续移动画布：会记录第一个点，然后根据后边的点算新的位置，适合鼠标拖动移动场景">
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
					<OperateGroup desc="缩放画布">
						<Button.Group >
							<Button onClick={() => {
								imgMark.current?.scale(-1, 'center', 'image')
							}}>Img Center-</Button>
							<Button onClick={() => {
								imgMark.current?.scaleTo({
									to: 'image',
									size: 'cover'
								}, 'center', 'image')
							}}>Scale To Cover</Button>
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
