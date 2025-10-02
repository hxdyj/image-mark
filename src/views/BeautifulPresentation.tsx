import React, { useEffect, useMemo, useRef, useState } from 'react'
import './BeautifulPresentation.scss'
import { ShapeData, ShapeOptions } from '#/shape/Shape'
import { ImageMarkShape } from '../../package/shape/Shape';
import ImageMark, { EventBusEventName, getDefaultImageMarkStatus, ImageMarkCircle, ImageMarkDot, ImageMarkImage, ImageMarkLine, ImageMarkPathLine, ImageMarkPolygon, ImageMarkPolyLine, ImageMarkRect, ImageMarkStatus, ShapePlugin } from '#/index';
import { demoData } from '../data/fullDemo.data';
import { Badge, Button, ColorPicker, Descriptions, Divider, Drawer, Empty, Form, Input, Message, Modal, Popover, Radio, Select, Table, Tooltip } from '@arco-design/web-react';
import { IconFont } from '../components/Iconfont';
import { IconRedo, IconUndo } from '@arco-design/web-react/icon';
import { SelectionType } from '#/plugins/SelectionPlugin';
import { useLocalStorage } from 'usehooks-ts'
import { ModalReturnProps } from '@arco-design/web-react/es/Modal/modal';
import { ImageData } from '#/shape/Image';
import Editor, { useMonaco, loader } from '@monaco-editor/react';
import { clone } from 'lodash-es';
import { useImmer } from 'use-immer';
import { LabeledValue, OptionInfo } from '@arco-design/web-react/es/Select/interface';
import { uid } from 'uid';
import createColor from "create-color";
import md5 from 'md5';
import { getOptimalTextColor } from '#/utils/color.util';
import Color from 'color';

loader.config({
	paths: {
		vs: '/vs'
	}
});

/*
TODO:
1. category
4. docs
5. rect data small zero
6. readme screenshot
7. context menu for container reset position/delete all
8. context menu for shape category/label
9. shape category render diff color
10. setCurrentPage src
11. export data file
12. import data
*/

const iconColor = `#111`

export type CategoryItem = {
	category_id: string
	name: string
	color?: string
}
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

	const [status, setStatus] = useState(getDefaultImageMarkStatus())

	const [startDrawing, setStartDrawing] = useState(false)

	const [selectCategory, setSelectCategory] = useLocalStorage<string | undefined>('selectCategory', undefined)

	const [categoryList, setCategoryList] = useLocalStorage<CategoryItem[]>('categoryList', [
		{
			category_id: '1',
			name: 'car',
		},
		{
			category_id: '2',
			name: 'empty parking space',
		},
	])


	const [scale, setScale] = useState(1)
	const [shapeDataList, setShapeDataList] = useState<ShapeData[]>([])

	const [selectShapeList, setSelectShapeList] = useState<ImageMarkShape[]>([])

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
						// fill: 'black',
					}
				},
				auxiliary: {
					stroke: {
						color: '#FADC19',
					}
				}
			}
		},
		initDrawFunc(shapeInstance: ImageMarkShape) {
			const categoryList = JSON.parse(localStorage.getItem('categoryList') || '[]') as Array<CategoryItem>
			const category = categoryList?.find(c => c.category_id == shapeInstance.data.category_id)
			if (category) {
				const color = category.color || '#FADC19'
				shapeInstance.getMainShape()?.stroke({
					color,
				})

				shapeInstance.getLabelShape()?.find('rect')[0]?.fill(color)
				shapeInstance.getLabelShape()?.find('rect')[0]?.fill(color)
				if (shapeInstance.data.shapeName == 'polygon') {
					shapeInstance.shapeInstance.find('line')[0]?.stroke({
						color: Color(color).alpha(0.7).rgb().string(),
					})
				}
			}
		}
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
		})
			.on(EventBusEventName.history_change, (info: { undo: number, redo: number }) => {
				setHistoryStackInfo(info)
			})
			.on(EventBusEventName.shape_context_menu, (evt: MouseEvent, shape: ImageMarkShape) => {
				evt.preventDefault()
				console.log(shape)
			})
			.on(EventBusEventName.container_context_menu, (evt: MouseEvent, imgMark: ImageMarkShape) => {
				evt.preventDefault()
				console.log(imgMark)
			})
			.on(EventBusEventName.first_render, () => {
				imgMark.current?.setReadonly(readonly ? true : false)
				imgMark.current?.getSelectionPlugin()?.mode(selectMode)
				setScale(imgMark.current?.getCurrentScale() || 1)
			})
			.on(EventBusEventName.shape_add, (data: ShapeData, shape: ImageMarkShape) => {
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
					okText: 'Add',
					unmountOnExit: true,
					content: <Input defaultValue={name} onChange={v => name = v} onKeyDown={e => {
						if (e.key === 'Enter') {
							onOk()
						}
					}} />,
					onOk
				})
			})
			.on(EventBusEventName.scale, (scale: number) => {
				setScale(scale)
			})
			.on(EventBusEventName.status_change, (status: ImageMarkStatus) => {
				console.log('status_change', status)
				setStatus(clone(status))
			})
			.on(EventBusEventName.shape_start_drawing, (shape: ImageMarkShape) => {
				console.log('shape_start_drawing', shape)
				setStartDrawing(true)
			})
			.on(EventBusEventName.shape_end_drawing, (cancel: boolean, data: ShapeData) => {
				console.log('shape_end_drawing', cancel, data)
				setStartDrawing(false)
			})
			.on(EventBusEventName.selection_select_list_change, (list: ImageMarkShape[]) => {
				console.log('selection_select_list_change', list)
				setSelectShapeList(list.slice())
			})
			.on(EventBusEventName.shape_data_change, () => {
				console.log('shape_data_change');
			})
		return () => {
			imgMark.current?.destroy()
		}
	}, [])
	const drawingTipFlag = startDrawing && ['polygon', 'polyline'].includes(status.drawing?.data.shapeName || '')
	const hasSelectShape = selectShapeList.length > 0 && !drawingTipFlag
	const drawType = status?.drawing && !startDrawing
	const showStatusTip = drawingTipFlag || hasSelectShape || drawType
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
									category_id: selectCategory,
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
									category_id: selectCategory,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Pathline'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-quxian-" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPathLine({
									shapeName: 'pathline',
									points: [],
									category_id: selectCategory,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Polyline'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhixianduan" style={{ fontSize: '26px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPolyLine({
									shapeName: 'polyline',
									points: [],
									category_id: selectCategory,
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
									category_id: selectCategory,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Tooltip content='Polygon'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-polygon" style={{ fontSize: '17px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkPolygon({
									shapeName: 'polygon',
									points: [],
									category_id: selectCategory,
								}, imgMark.current))
							}} />
						</Tooltip>
						<Popover trigger={'hover'} content={
							<div className='flex items-center gap-2'>
								{
									['/img/star.svg', '/img/hello.png'].map(i => {
										return <img key={i} src={i} alt={i} className='w-[26px] h-[26px] cursor-pointer' onClick={() => {
											const data: ImageData = {
												shapeName: 'image',
												x: 0,
												y: 0,
												width: 0,
												height: 0,
												src: i,
												category_id: selectCategory,
											}
											imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkImage(data, imgMark.current))
										}} />
									})
								}
							</div>
						}>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-tuxinghuizhi" style={{ fontSize: '18px', color: iconColor }} />} />
						</Popover>
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
					<Select value={selectCategory}
						renderFormat={
							(option: OptionInfo | null, value: string | number | LabeledValue) => {
								const category = categoryList.find(c => c.category_id === option?.value)
								return <div className='flex gap-x-4 items-center'>
									<ColorPicker disabled value={category?.color || '#ff7d00'} />
									<div>
										{category?.name}
									</div>
								</div>
							}
						}
						placeholder='Category'
						triggerProps={{ className: 'comp-beautiful-presentation-select-category-trigger' }}
						className={'min-w-[160px]'}
						prefix={<IconFont type="icon-flag" style={{ fontSize: '20px', color: iconColor }} />}
						notFoundContent={
							<div className='text-[12px] text-[#999] p-2'>
								<Empty description="None category" />
							</div>
						}
						allowClear
						onChange={value => {
							setSelectCategory(value)
						}}
					>
						<div className='px-3 pt-1'>
							<Button long type='default' onClick={(e) => {
								e.stopPropagation()
								let name = ''
								let modal: ModalReturnProps | null = null

								function onOk() {
									if (!name) {
										return Message.error('Please input category name')
									}
									const item: CategoryItem = {
										category_id: uid(6),
										name
									}
									item.color = getCategoryColor(item)
									categoryList.push(item)
									setCategoryList(categoryList)
									modal?.close()
									Message.success({
										content: 'Add category success',
										duration: 600
									})
								}
								modal = Modal.confirm({
									unmountOnExit: true,
									title: 'Add Category',
									content: <Input defaultValue={name} onChange={value => {
										name = value
									}} onKeyDown={e => {
										if (e.key === 'Enter') {
											onOk()
										}
									}} />,
									onOk: async (e) => {
										e?.stopPropagation()
										onOk()
									}
								})
							}}>Add Category</Button>
							<Divider className={'my-2'} />

						</div>
						{
							categoryList.map(category => {
								return <Select.Option value={category.category_id} key={category.category_id}>
									<div className='flex  items-center gap-x-4 justify-between'>
										<div className='flex items-center gap-x-4'>
											<div className='flex items-center' onClick={e => {
												e.stopPropagation()
											}}>
												<ColorPicker disabledAlpha value={category.color || '#ff7d00'} onChange={color => {
													category.color = color.toString()
													setCategoryList(categoryList)
													const shapePlugin = imgMark.current?.getShapePlugin()
													const list = shapePlugin?.data.filter(shape => shape.category_id === category.category_id) || []
													list.forEach(shapeData => {
														const shapeInstance = shapePlugin?.getInstanceByData(shapeData)
														shapeInstance?.draw()
													})
												}} />
											</div>
											<div>
												{category.name}
											</div>
										</div>
										<Button type='text' icon={<IconFont type="icon-del" style={{ fontSize: '20px', color: iconColor }} />} onClick={(e) => {
											e.stopPropagation()
											setCategoryList(categoryList.filter(c => c.category_id !== category.category_id))
											if (selectCategory === category.category_id) {
												setSelectCategory(undefined)
											}
										}} />
									</div>
								</Select.Option>
							})
						}

					</Select>
				</div>
				<div>
					<div className='flex items-center gap-x-6'>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Reset Position & Scale'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-guiwei" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
									imgMark.current?.scaleTo(imgMark.current.options.initScaleConfig, 'center', 'image')
									imgMark.current?.moveTo('center')

								}} />
							</Tooltip>
							<Tooltip content='Show Data'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-chakanshuju" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
									setShapeDataList(imgMark.current?.getShapePlugin()?.data.slice() || [])
									setDrawerVisible(false)
									setShapeDataVisible(true)
								}} />
							</Tooltip>
						</div>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Scale -'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale-" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
									imgMark.current?.scale(-1, 'center', 'image')
								}} />
							</Tooltip>
							<div className='scale-text w-[30px] flex justify-center items-center'>{(scale * 100).toFixed(0)}%</div>
							<Tooltip content='Scale +'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale_plus" style={{ fontSize: '22px', color: iconColor }} />} onClick={() => {
									imgMark.current?.scale(+1, 'center', 'image')
								}} />
							</Tooltip>
						</div>
						<div className='flex items-center gap-x-2'>
							<Tooltip content='Shortcuts'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-kuaijiejian" style={{ fontSize: '18px', color: iconColor }} />} onClick={() => {
									Modal.info({
										title: 'Shortcuts',
										footer: null,
										closable: true,
										className: 'w-[600px]',
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
											{
												label: <div>
													<div>
														Delete All Shapes
													</div>
												</div>,
												value: <kbd>ctrl/command + delete</kbd>
											},
											{
												label: 'Undo',
												value: <kbd>ctrl/command + z</kbd>
											},
											{
												label: 'Redo',
												value: <kbd>ctrl/command + y</kbd>
											},
											{
												label: 'Move Mode',
												value: <div>hold <kbd>space</kbd></div>
											},
											{
												label: 'Multiple Select Mode',
												value: <div>hold <kbd>ctrl/command</kbd> + click</div>
											},
										]} />
									})
								}} />
							</Tooltip>
							<Tooltip content='Settings'>
								<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-weixuanzhongbeifen" style={{ fontSize: '15px', color: iconColor }} />} onClick={() => {
									setShapeDataVisible(false)
									setDrawerVisible(true)
								}} />
							</Tooltip>
							{/* <Button type='text' onClick={() => {
								imgMark.current?.getShapePlugin()?.setData([
									{
										shapeName: 'dot',
										uuid: '234',
										x: 100,
										y: 100,
										r: 10
									}
								])
							}}>
								Set Data
							</Button> */}
						</div>

					</div>
				</div>

			</div>
			<div className="image-mark-container min-h-0 flex-grow relative" ref={drawerTargetRef}>
				<div ref={containerRef} className="shape-container h-full"></div>
				{
					showStatusTip ?
						<div className='status-tip absolute left-0 top-0 p-2 flex flex-col gap-y-2'>
							{
								drawingTipFlag ?
									<>
										<div>press <kbd>delete</kbd> to delete last point</div>
										<div>press <kbd>enter</kbd> to confirm drawing shape</div>
										<div>press <kbd>esc</kbd> to cancel drawing shape</div>
									</> : null
							}
							{
								hasSelectShape ?
									<div>press <kbd>delete</kbd> to delete selected shapes</div> : null
							}
							{
								drawType ?
									{
										'dot': <div>click on container to confirm drawing dot</div>,
										'line': <div>hold lmb to move on container drawing line</div>,
										'pathline': <div>hold lmb to move on container drawing pathline</div>,
										'polyline': <div>click on container multiple to drawing polyline</div>,
										'rect': <div>hold lmb to move on container drawing rect</div>,
										'polygon': <div>click on container multiple to drawing polygon</div>,
										'circle': <div>hold lmb to move on container drawing circle</div>,
										'image': <div>hold lmb to move on container drawing image</div>,
									}[status.drawing?.data?.shapeName || '']
									: null
							}
						</div> : null
				}

			</div>

			<Drawer
				footer={null}
				width={332}
				title={<span>Settings</span>}
				visible={drawerVisible}
				unmountOnExit
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
					{/* TODO  enable draw outof image*/}
				</Form>
			</Drawer>
			<Drawer
				footer={null}
				width={660}
				title={<span>Shape Data</span>}
				visible={shapeDataVisible}
				unmountOnExit
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


export function getCategoryColor(category: CategoryItem) {
	return createColor(md5(category.category_id + category.name), {
		format: 'hex',
	})
}
