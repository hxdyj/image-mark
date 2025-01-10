import ImageMark from "#/index"
import { useEffect, useRef } from "react"
import { SchemaDTO, TeamMarkPlugin } from "../components/ImageMark/plugins/TeamMarkPlugin"
import { Tree } from "@arco-design/web-react"
import { cloneDeep } from "lodash-es"
import { ImageMarkEventKey, TeamData, TeamShape } from "../components/ImageMark/shape/TeamShape"
import { LmbMoveAction } from "#/action/LmbMoveAction"
import { Circle, MatrixExtract } from "@svgdotjs/svg.js"
import { ImageMarkShape } from "#/shape/Shape"
export function TeamMarkPluginDemo() {
	const containerRef = useRef<HTMLDivElement>(null)
	const imgMark = useRef<ImageMark | null>(null)
	let treeData: SchemaDTO.TreeNode | null = {
		"name": "A",
		"uuid": "685d462a4",
		"num": 1,
		"remark": "",
		"children": [
			{
				"name": "B",
				"uuid": "9894a1987",
				"num": 1,
				"remark": "",
				"children": [
					{
						"name": "B1",
						"uuid": "894a19870",
						"num": 1,
						"remark": "",
						"children": []
					},
					{
						"name": "B2",
						"uuid": "94a198705",
						"num": 1,
						"remark": "",
						"children": []
					},
					{
						"name": "B3",
						"uuid": "4a1987058",
						"num": 9,
						"remark": "",
						"children": []
					}
				]
			},
			{
				"name": "C",
				"uuid": "05806ce43",
				"num": 1,
				"remark": "",
				"children": [
					{
						"name": "C1",
						"uuid": "5806ce43d",
						"num": 1,
						"remark": "",
						"children": []
					},
					{
						"name": "C2",
						"uuid": "806ce43d7",
						"num": 9,
						"remark": "",
						"children": []
					},
					{
						"name": "C3",
						"uuid": "06ce43d71",
						"num": 1,
						"remark": "",
						"children": []
					}
				]
			},
			{
				"name": "D",
				"uuid": "d71d4fcf3",
				"num": 1,
				"remark": "",
				"children": [
					{
						"name": "D1",
						"uuid": "71d4fcf38",
						"num": 1,
						"remark": "",
						"children": []
					},
					{
						"name": "D2",
						"uuid": "1d4fcf389",
						"num": 9,
						"remark": "",
						"children": []
					},
					{
						"name": "D3",
						"uuid": "d4fcf3891",
						"num": 1,
						"remark": "",
						"children": []
					}
				]
			}
		]
	}

	useEffect(() => {
		if (!containerRef.current) return
		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/demo-parking.jpg',
			enableImageOutOfContainer: false,
			initScaleConfig: {
				startPosition: 'center',
				size: 'cover',
				padding: 0
			},
			pluginOptions: {
				[TeamMarkPlugin.pluginName]: {
					shapeList: []
				}
			}
		}).addPlugin((instance) => {
			const teamMarkPluginInstance = new TeamMarkPlugin(instance)
			teamMarkPluginInstance.addShape(TeamShape, {
				afterRender(shapeInstance) {
					shapeInstance.addAction(LmbMoveAction, {
						limit(imageMark: ImageMark, shape: TeamShape, nextTransform: MatrixExtract) {
							let { translateX = 0, translateY = 0 } = nextTransform
							let { naturalHeight, naturalWidth } = imageMark.imageDom
							let isOutOfBounds = false
							const fixTranslate = [0, 0]
							if (translateX < 0) {
								isOutOfBounds = true
								fixTranslate[0] = -translateX
							}

							if (translateX > naturalWidth) {

								isOutOfBounds = true
								fixTranslate[0] = naturalWidth - translateX
							}

							if (translateY < 0) {

								isOutOfBounds = true
								fixTranslate[1] = -translateY
							}

							if (translateY > naturalHeight) {

								isOutOfBounds = true
								fixTranslate[1] = naturalHeight - translateY
							}
							return fixTranslate

						},
						onEnd(imageMark: ImageMark, shape: ImageMarkShape) {
							const teamData = shape.data as TeamData
							const { translateX = teamData.x, translateY = teamData.y } = shape.shapeInstance.transform()
							const coordinate = [translateX, translateY]
							console.log('coordinate', coordinate)
							imageMark.eventBus.emit(ImageMarkEventKey.TEAM_SHAPE_LMB_MOVE_END, imageMark, shape, coordinate)
						}
					}
					)
				},
			})
			return teamMarkPluginInstance
		})
		return () => {
			imgMark.current?.destroy()
		}
	}, [])
	const ghostRef = useRef<HTMLDivElement>(null)

	return (
		<div className="page-team-mark-plugin-demo flex h-[100vh]">
			<div ref={ghostRef}
				className=" absolute bottom-0 left-0 text-center text-white bg-[#165DFF] px-4 py-2 rounded-md -z-10">
			</div>
			<div className="w-[300px]">
				<Tree
					fieldNames={{
						key: 'uuid',
						title: 'name'
					}}
					blockNode
					draggable treeData={treeData ? [treeData] : []}
					onDragStart={(ev, node) => {
						const ghostEle = ghostRef.current
						if (ghostEle) {
							let { title = 'No Title' } = node.props
							ghostEle.textContent = title as string
							if (ev.dataTransfer) {
								ev.dataTransfer.effectAllowed = "copy";

								let nodeData = node.props.dataRef as SchemaDTO.TreeNode
								let newData = cloneDeep(nodeData)

								Reflect.set(newData, '_prefixName', '')

								ev.dataTransfer?.setData('text/plain', JSON.stringify(newData))
								const rect = ghostEle.getBoundingClientRect()
								ev.dataTransfer?.setDragImage(ghostEle, rect.width / 2, rect.height)
							}
						}
					}}

				/>

			</div>
			<div className="img-mark-container flex-grow min-w-0" ref={containerRef}></div>
		</div>
	)
}
