import React, { useEffect, useRef, useState } from 'react'
import './BeautifulPresentation.scss'
import { ShapeData, ShapeOptions } from '#/shape/Shape'
import { ImageMarkShape } from '../../package/shape/Shape';
import ImageMark, { EventBusEventName, ImageMarkCircle, ImageMarkDot, ImageMarkImage, ImageMarkLine, ImageMarkPathLine, ImageMarkPolygon, ImageMarkPolyLine, ImageMarkRect, ShapePlugin } from '#/index';
import { demoData } from '../data/fullDemo.data';
import { Badge, Button, Descriptions, Drawer, Form, Input, Modal, Radio, Table, Tooltip } from '@arco-design/web-react';
import { IconFont } from '../components/Iconfont';
import { IconRedo, IconUndo } from '@arco-design/web-react/icon';
import { SelectionType } from '#/plugins/SelectionPlugin';
import { useLocalStorage } from 'usehooks-ts'
import { ModalReturnProps } from '@arco-design/web-react/es/Modal/modal';
import { ImageData } from '#/shape/Image';
import Editor, { useMonaco, loader } from '@monaco-editor/react';
loader.config({
	paths: {
		vs: '/vs'
	}
});

const iconColor = `#111`
export function BeautifulPresentation() {
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const drawerTargetRef = useRef<HTMLDivElement>(null)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [shapeDataVisible, setShapeDataVisible] = useState(false)

	const [historyStackInfo, setHistoryStackInfo] = useState<{ undo: number, redo: number }>({
		undo: 0,
		redo: 0
	})

	const [readonly, setReadonly] = useLocalStorage('readOnly', false)
	const [selectMode, setSelectMode] = useLocalStorage<SelectionType>('selectMode', 'single')

	const [scale, setScale] = useState(1)
	const [shapeDataList, setShapeDataList] = useState<ShapeData[]>([])

	useEffect(() => {
		imgMark.current?.setReadonly(readonly ? true : false)
	}, [readonly])

	useEffect(() => {
		imgMark.current?.getSelectionPlugin()?.mode(selectMode)
	}, [selectMode])

	const shapeList = useRef<ShapeData[]>(demoData)
	const shapeOptions: ShapeOptions = {
		setAttr(shapeInstance: ImageMarkShape) {
			return {
				label: {
					font: {
						fill: 'black',
					}
				},
				auxiliary: {
					stroke: {
						color: '#FADC19',
					}
				}
			}
		},
	}

	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")

		imgMark.current = new ImageMark({
			el: containerRef.current,
			src: '/img/demo-parking.jpg',
			readonly,
			pluginOptions: {
				[ShapePlugin.pluginName]: {
					shapeList: shapeList.current,
					shapeOptions
				}
			},
		}).on(EventBusEventName.history_change, (info: { undo: number, redo: number }) => {
			setHistoryStackInfo(info)
		}).on(EventBusEventName.shape_context_menu, (evt: MouseEvent, shape: ImageMarkShape) => {
			evt.preventDefault()
			console.log(shape)
		}).on(EventBusEventName.container_context_menu, (evt: MouseEvent, imgMark: ImageMarkShape) => {
			evt.preventDefault()
			console.log(imgMark)
		}).on(EventBusEventName.first_render, () => {
			imgMark.current?.setReadonly(readonly ? true : false)
			imgMark.current?.getSelectionPlugin()?.mode(selectMode)
			setScale(imgMark.current?.getCurrentScale() || 1)
		}).on(EventBusEventName.shape_add, (data: ShapeData, shape: ImageMarkShape) => {
			let name = ''
			let modal: ModalReturnProps | null = null
			function onOk() {
				data.label = name
				shape.updateData(data)
				modal?.close()
			}
			modal = Modal.confirm({
				title: 'Set Shape Label',
				cancelText: 'Cancel',
				okText: 'Set',
				content: <Input defaultValue={name} onChange={v => name = v} onKeyDown={e => {
					if (e.key === 'Enter') {
						onOk()
					}
				}} />,
				onOk
			})
		}).on(EventBusEventName.scale, (scale: number) => {
			setScale(scale)
		})
		return () => {
			imgMark.current?.destroy()
		}
	}, [])

	return (
		<div className="comp-beautiful-presentation flex flex-col h-full min-h-[500px]" >
			<div className='header h-[40px] flex-shrink-0 flex-grow-0 bg-[white] px-2 flex justify-between items-center'>
				<div className='flex items-center gap-x-6'>
					<div className='flex items-center gap-x-2'>
						<Tooltip content='Dot'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhidian" style={{ fontSize: '18px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkDot({
									shapeName: 'dot',
									x: 0,
									y: 0,
									r: 0,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Line'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhixian2" style={{ fontSize: '26px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkLine({
									shapeName: 'line',
									x: 0,
									y: 0,
									x2: 0,
									y2: 0,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Pathline'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-quxian-" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPathLine({
									shapeName: 'pathline',
									points: []
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Polyline'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhixianduan" style={{ fontSize: '26px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPolyLine({
									shapeName: 'polyline',
									points: []
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Rect'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhimian1" style={{ fontSize: '20px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkRect({
									shapeName: 'rect',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Polygon'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-polygon" style={{ fontSize: '17px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPolygon({
									shapeName: 'polygon',
									points: []
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Image'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-tuxinghuizhi" style={{ fontSize: '18px', color: iconColor }} />} onClick={() => {
								const data: ImageData = {
									shapeName: 'image',
									x: 0,
									y: 0,
									width: 0,
									height: 0,
									src: '',
								}
								let name = ''
								let modal: ModalReturnProps | null = null
								function onOk() {
									data.src = name
									modal?.close()
									imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkImage(data, imgMark.current))
								}
								modal = Modal.confirm({
									title: 'Select Draw Image',
									footer: null,
									closable: true,
									content: <div className='flex items-center'>
										{
											['/img/star.svg', '/img/hello.png'].map(i => {
												return <img key={i} src={i} alt={i} className='w-[50px] h-[50px] cursor-pointer' onClick={() => {
													name = i
													onOk()
												}} />
											})
										}
									</div>,
								})

							}} />
						</Tooltip>
					</div>
					<div className='flex items-center gap-x-2'>
						<Tooltip content='Undo'>
							<Badge
								dotClassName="history-badge"
								count={historyStackInfo?.undo}>
								<Button className={'icon-btn'} type={historyStackInfo?.undo ? 'primary' : 'text'} icon={<IconUndo style={{ fontSize: '18px', color: historyStackInfo?.undo ? 'white' : iconColor }} />} onClick={() => {
									imgMark?.current?.getHistoryPlugin()?.undo()
								}} />
							</Badge>
						</Tooltip>
						<Tooltip content='Redo'>
							<Badge
								dotClassName="history-badge"
								count={historyStackInfo?.redo}>
								<Button className={'icon-btn'} type={historyStackInfo?.redo ? 'primary' : 'text'} icon={<IconRedo style={{ fontSize: '18px', color: historyStackInfo?.redo ? 'white' : iconColor }} />} onClick={() => {
									imgMark?.current?.getHistoryPlugin()?.redo()
								}} />

							</Badge>
						</Tooltip>
					</div>
					<Tooltip content='Remove All Nodes'>
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-del" style={{ fontSize: '20px', color: iconColor }} />} onClick={() => {
							imgMark?.current?.getShapePlugin()?.removeAllNodes()
						}} />
					</Tooltip>
				</div>
				<div>
					<div className='flex items-center gap-x-6'>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Reset Position & Scale'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-guiwei" style={{ fontSize: '22px', color: iconColor }} onClick={() => {
									imgMark.current?.scaleTo(imgMark.current.options.initScaleConfig, 'center', 'image')
									imgMark.current?.moveTo('center')

								}} />} />
							</Tooltip>
							<Tooltip content='Show Data'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-chakanshuju" style={{ fontSize: '22px', color: iconColor }} onClick={() => {
									setShapeDataList(imgMark.current?.getShapePlugin()?.data.slice() || [])
									setShapeDataVisible(true)
								}} />} />
							</Tooltip>
						</div>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Scale -'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale-" style={{ fontSize: '22px', color: iconColor }} onClick={() => {
									imgMark.current?.scale(-1, 'center', 'image')
								}} />} />
							</Tooltip>
							<div className='scale-text'>{(scale * 100).toFixed(0)}%</div>
							<Tooltip content='Scale +'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale_plus" style={{ fontSize: '22px', color: iconColor }} onClick={() => {
									imgMark.current?.scale(+1, 'center', 'image')
								}} />} />
							</Tooltip>
						</div>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Shortcuts'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-kuaijiejian" style={{ fontSize: '18px', color: iconColor }} onClick={() => {
									Modal.info({
										title: 'Shortcuts',
										footer: null,
										closable: true,
										className: 'w-[500px]',
										content: <Descriptions border column={1} data={[
											{
												label: 'Dot',
												value: <kbd>alt/option + 1</kbd>
											},
											{
												label: 'Line',
												value: <kbd>alt/option + 2</kbd>
											},
											{
												label: 'Pathline',
												value: <kbd>alt/option + 3</kbd>
											},
											{
												label: 'Polyline',
												value: <kbd>alt/option + 4</kbd>
											},
											{
												label: 'Rect',
												value: <kbd>alt/option + 5</kbd>
											},
											{
												label: 'Polygon',
												value: <kbd>alt/option + 6</kbd>
											},
											{
												label: <div>
													<div>Confirm Drawing Shape</div>
													<div>(eg: polygon polyline)</div>
												</div>,
												value: <kbd>enter</kbd>
											},
											{
												label:
													<div>
														<div>Delete Last Point of Drawing Shape</div>
														<div>(eg: polygon polyline)</div>
													</div>,
												value: <kbd>delete</kbd>
											},
											{
												label: <div>
													<div>
														Delete Selected Shapes
													</div>
												</div>,
												value: <kbd>delete</kbd>
											},
										]} />
									})
								}} />} />
							</Tooltip>
							<Tooltip content='Settings'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-weixuanzhongbeifen" style={{ fontSize: '15px', color: iconColor }} />} onClick={() => {
									setDrawerVisible(true)
								}} />
							</Tooltip>
						</div>

					</div>
				</div>

			</div>
			<div className="image-mark-container min-h-0 flex-grow relative" ref={drawerTargetRef}>
				<div ref={containerRef} className="shape-container h-full"></div>
			</div>

			<Drawer
				footer={null}
				width={332}
				title={<span>Settings</span>}
				visible={drawerVisible}
				getPopupContainer={() => drawerTargetRef && drawerTargetRef.current!}
				onOk={() => {
					setDrawerVisible(false);
				}}
				onCancel={() => {
					setDrawerVisible(false);
				}}
			>
				<Form layout='vertical'>
					<Form.Item label="Select Mode" field={'selectMode'} initialValue={selectMode}>
						<Radio.Group type='button' onChange={val => setSelectMode(val)}>
							<Radio value={'single'}>Single</Radio>
							<Radio value={'multiple'}>Multiple</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Readonly" field={'readonly'} initialValue={readonly}>
						<Radio.Group type='button' onChange={val => setReadonly(val)}>
							<Radio value={true}>On</Radio>
							<Radio value={false}>Off</Radio>
						</Radio.Group>
					</Form.Item>
				</Form>
			</Drawer>
			<Drawer
				footer={null}
				width={660}
				title={<span>Shape Data</span>}
				visible={shapeDataVisible}
				getPopupContainer={() => drawerTargetRef && drawerTargetRef.current!}
				onOk={() => {
					setShapeDataVisible(false);
				}}
				onCancel={() => {
					setShapeDataVisible(false);
				}}
			>

				<Editor height="100%" options={{
					readOnly: true,
				}} theme={'vs-dark'} defaultLanguage="json" value={JSON.stringify(shapeDataList, null, 2)} />
			</Drawer>
		</div>
	)
}
