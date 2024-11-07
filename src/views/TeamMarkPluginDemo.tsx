import ImageMark from "#/index"
import { useEffect, useRef } from "react"
import { SchemaDTO, TeamMarkPlugin } from "../components/ImageMark/plugins/TeamMarkPlugin"
import { Tree } from "@arco-design/web-react"
import { cloneDeep } from "lodash-es"
import { TeamShape } from "../components/ImageMark/shape/TeamShape"
TeamMarkPlugin.useShape(TeamShape)
ImageMark.usePlugin(TeamMarkPlugin)
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
		})
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
			<div className="img-mark-container flex-grow" ref={containerRef}></div>
		</div>
	)
}
