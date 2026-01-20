import React, { useDebugValue, useEffect, useMemo, useRef, useState } from 'react'
import './BeautifulPresentation.scss'
import { ShapeData, ShapeOptions } from '#/shape/Shape'
import { ImageMarkShape } from '../../package/shape/Shape';
import ImageMark, { getDefaultImageMarkStatus, ImageMarkCircle, ImageMarkDot, ImageMarkImage, ImageMarkLine, ImageMarkPathLine, ImageMarkPolygon, ImageMarkPolyLine, ImageMarkRect, ImageMarkStatus, ShapePlugin } from '#/index';
import { demoData } from '../data/fullDemo.data';
import { Badge, Button, ColorPicker, Descriptions, Divider, Drawer, Empty, Form, Input, Menu, Message, Modal, Popover, Radio, Select, Space, Table, Tooltip, Trigger, Upload } from '@arco-design/web-react';
import { IconFont } from '../components/Iconfont';
import { IconRedo, IconUndo } from '@arco-design/web-react/icon';
import { SelectionType } from '#/plugins/SelectionPlugin';
import { useLocalStorage } from 'usehooks-ts'
import { ModalReturnProps } from '@arco-design/web-react/es/Modal/modal';
import { ImageData } from '#/shape/Image';
import Editor, { useMonaco, loader } from '@monaco-editor/react';
import { clone, debounce, set } from 'lodash-es';
import { useImmer } from 'use-immer';
import { LabeledValue, OptionInfo } from '@arco-design/web-react/es/Select/interface';
import { uid } from 'uid';
import createColor from "create-color";
import md5 from 'md5';
import Color from 'color';
import { EventBusEventName } from '../../package/event/const';
import hotkeys from 'hotkeys-js';

loader.config({
	paths: {
		vs: '/vs'
	}
});


const iconColor = `#111`

export type CategoryItem = {
	category_id: string
	name: string
	color?: string
}

const DEFAULT_SRC = '/img/demo-parking.jpg'
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
	const [drawOutOfImg, setDrawOutOfImg] = useLocalStorage<boolean>('drawOutOfImg', false)
	const [src, setSrc] = useLocalStorage('src', DEFAULT_SRC)

	const [status, setStatus] = useState(getDefaultImageMarkStatus())

	const [startDrawing, setStartDrawing] = useState(false)
	const tmpShape = useRef<ImageMarkShape | null>(null)
	const [selectCategory, setSelectCategory] = useLocalStorage<string | undefined>('selectCategory', undefined)
	const [contextType, setContextType] = useState<'shape' | 'container' | ''>('')
	const [contextMenuStartPosition, setContextMenuStartPosition] = useState<{ x: number, y: number } | null>(null)

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
		imgMark.current?.setEnableShapeOutOfImg(drawOutOfImg)
	}, [drawOutOfImg])

	useEffect(() => {
		imgMark.current?.getSelectionPlugin()?.mode(selectMode)
	}, [selectMode])


	useEffect(() => {
		hotkeys('esc', (e) => {
			hideContextMenu()
		})
		return () => {
			hotkeys.unbind('esc')
		}
	}, [])

	const updateLocalStorageShapeList = debounce(() => {
		localStorage.setItem('shapeList', JSON.stringify(imgMark.current?.getShapePlugin()?.data || []))
	}, 300, {
		trailing: true,
		leading: false,
	})

	const initShapeList = localStorage.getItem('shapeList') ? JSON.parse(localStorage.getItem('shapeList') || '[]') : demoData
	const shapeList = useRef<ShapeData[]>(initShapeList)
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

	function hideContextMenu() {
		setContextType('')
		setContextMenuStartPosition(null)
	}

	function changeSrc() {
		let srcValue = src
		let modal: ModalReturnProps | null = null
		function onOk() {
			setSrc(srcValue)
			modal?.close()
		}
		modal = Modal.confirm({
			title: 'Set Img Src',
			content:
				<Input defaultValue={srcValue}
					onChange={v => {
						srcValue = v
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							onOk()
						}
					}}
				/>,
			onOk,
		})
	}

	function editShapeLabel() {
		let name = tmpShape.current?.data?.label || ''
		let modal: ModalReturnProps | null = null
		function onOk() {
			tmpShape.current?.startModifyData()
			const data = tmpShape.current?.data!
			data.label = name
			tmpShape.current?.updateData(data)
			modal?.close()
		}
		modal = Modal.confirm({
			title: 'Set Shape Label',
			cancelText: 'Cancel',
			okText: 'Submit',
			unmountOnExit: true,
			content: <Input defaultValue={name} onChange={v => name = v} onKeyDown={e => {
				if (e.key === 'Enter') {
					onOk()
				}
			}} />,
			onOk
		})
	}

	function editShapeCategory() {
		let category_id = tmpShape.current?.data?.category_id || ''
		let modal: ModalReturnProps | null = null
		function onOk() {
			tmpShape.current?.startModifyData()
			const data = tmpShape.current?.data!
			data.category_id = category_id
			tmpShape.current?.updateData(data)
			modal?.close()
		}
		modal = Modal.confirm({
			title: 'Set Shape Category',
			cancelText: 'Cancel',
			okText: 'Submit',
			unmountOnExit: true,
			content: <Select allowClear
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
				defaultValue={category_id} placeholder='Select Category' onChange={v => category_id = v} >
				{
					categoryList.map(category => {
						return <Select.Option value={category.category_id} key={category.category_id}>
							<div className='flex  items-center gap-x-4 justify-between'>
								<div className='flex items-center gap-x-4'>
									<div className='flex items-center' onClick={e => {
										e.stopPropagation()
									}}>
										<ColorPicker disabled value={category.color || '#ff7d00'} />
									</div>
									<div>
										{category.name}
									</div>
								</div>
								<Button type='text' icon={<IconFont type="icon-del" style={{ fontSize: '20px', color: iconColor }} />} onClick={(e) => {
									e.stopPropagation()
									category_id = category.category_id
								}} />
							</div>
						</Select.Option>
					})
				}
			</Select>,
			onOk
		})
	}

	useEffect(() => {
		if (!containerRef.current) throw new Error("containerRef is null")

		imgMark.current = new ImageMark({
			el: containerRef.current,
			src,
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
				evt.stopPropagation()
				evt.preventDefault()
				console.log('shape_context_menu')
				tmpShape.current = shape
				setContextType('shape')
				setContextMenuStartPosition({
					x: evt.clientX,
					y: evt.clientY,
				})
			})
			.on(EventBusEventName.container_context_menu, (evt: MouseEvent, imgMark: ImageMarkShape) => {
				evt.preventDefault()
				console.log('container_context_menu')
				setContextType('container')
				setContextMenuStartPosition({
					x: evt.clientX,
					y: evt.clientY,
				})
			})
			.on(EventBusEventName.first_render, () => {
				imgMark.current?.setReadonly(readonly ? true : false)
				imgMark.current?.getSelectionPlugin()?.mode(selectMode)
				imgMark.current?.setEnableShapeOutOfImg(drawOutOfImg)
				setScale(imgMark.current?.getCurrentScale() || 1)
			})
			.on(EventBusEventName.shape_add, (data: ShapeData, shape: ImageMarkShape) => {
				tmpShape.current = shape
				editShapeLabel()
			})
			.on(EventBusEventName.scale, (scale: number) => {
				setScale(scale)
			})
			.on(EventBusEventName.status_change, (status: ImageMarkStatus) => {
				console.log('status_change', status)
				setStatus(clone(status))
				hideContextMenu()
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
			.on(EventBusEventName.shape_plugin_data_change, (data: ShapeData[]) => {
				console.log('shape_plugin_data_change', data);
				updateLocalStorageShapeList()
			})
			.on(EventBusEventName.shape_click, (evt: MouseEvent) => {
				// evt.stopPropagation()
				console.log('shape_click');
				hideContextMenu()
			})
			.on(EventBusEventName.shape_delete_patch, (data: ShapeData[]) => {
				// evt.stopPropagation()
				console.log('shape_delete_patch', data);
			})

		containerRef.current.addEventListener('click', hideContextMenu)
		return () => {
			imgMark.current?.destroy()
			containerRef.current?.removeEventListener('click', hideContextMenu)
		}
	}, [src])
	const drawingTipFlag = startDrawing && ['polygon', 'polyline'].includes(status.shape_drawing?.data.shapeName || '')
	const drawingTwoTimesTipFlag = startDrawing && ['image', 'line', 'rect', 'circle'].includes(status.shape_drawing?.data.shapeName || '')
	const drawType = status?.shape_drawing && !startDrawing
	const hasSelectShape = !drawType && selectShapeList.length > 0 && !drawingTipFlag
	const showStatusTip = drawingTipFlag || hasSelectShape || drawType || drawingTwoTimesTipFlag
	return (
		<div className="comp-beautiful-presentation flex flex-col h-full min-h-[500px]" >

			<div className='header h-[40px] flex-shrink-0 flex-grow-0 bg-[white] px-2 flex justify-between items-center'>
				<div className='flex items-center gap-x-6'>
					<Tooltip content='Set Img Src'>
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-laiyuan" style={{ fontSize: '16px', color: iconColor }} />} onClick={changeSrc} />
					</Tooltip>
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
						<Tooltip content='Circle'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-biaozhuyuanxing" style={{ fontSize: '17px', color: iconColor }} />} onClick={() => {
								imgMark.current?.getShapePlugin()?.startDrawing(new ImageMarkCircle({
									shapeName: 'circle',
									x: 0,
									y: 0,
									r: 0,
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
												label: 'Circle',
												value: <kbd>alt/option + 6</kbd>
											},
											{
												label: 'Polygon',
												value: <kbd>alt/option + 7</kbd>
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
								drawingTwoTimesTipFlag ?
									<>
										<div>press <kbd>delete</kbd>/<kbd>esc</kbd> to cancel drawing shape</div>
										<div>click last point to confirm drawing shape</div>
									</> : null
							}
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
										'line': <div>click two times to draw line</div>,
										'pathline': <div>click two times to draw pathline</div>,
										'polyline': <div>click on container multiple to drawing polyline</div>,
										'rect': <div>click two times to draw rect</div>,
										'polygon': <div>click on container multiple to drawing polygon</div>,
										'circle': <div>click two times to draw circle</div>,
										'image': <div>click two times to draw image</div>,
									}[status.shape_drawing?.data?.shapeName || '']
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
					<Form.Item label="Draw Out of Image" field={'drawOutOfImg'} initialValue={drawOutOfImg}>
						<Radio.Group type='button' onChange={val => setDrawOutOfImg(val)}>
							<Radio value={true}>On</Radio>
							<Radio value={false}>Off</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Data" field={'resetData'}>
						<Space>
							<Button type='default' onClick={() => {
								imgMark.current?.getShapePlugin()?.setData(demoData)
							}}>
								Reset Data
							</Button>
							<Button type='default' onClick={() => {
								setSrc(DEFAULT_SRC)
							}}>
								Reset Src
							</Button>
							<Upload accept={'.json'} showUploadList={false} customRequest={({ file }) => {
								const reader = new FileReader()
								reader.readAsText(file, 'utf-8')
								reader.onload = () => {
									const shapeDataList = JSON.parse(reader.result as string)
									imgMark.current?.getShapePlugin()?.setData(shapeDataList)
									Message.success('Import Success')
									setDrawerVisible(false)
								}
							}}>
								<Button type='default' onClick={() => {
								}}>
									Import
								</Button>
							</Upload>
						</Space>
					</Form.Item>
				</Form>
			</Drawer>
			<Drawer
				footer={null}
				width={660}
				title={<Space size={'large'}>
					<div>Shape Data</div>
					<Button type='default' size='small' onClick={() => {
						const shapeDataList = imgMark.current?.getShapePlugin()?.data
						const blob = new Blob([JSON.stringify(shapeDataList, null, 2)], { type: 'application/json' })
						const a = document.createElement('a')
						a.href = URL.createObjectURL(blob)
						a.download = 'shape-data.json'
						a.click()
					}}>Export</Button>
				</Space>}
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
			{
				contextMenuStartPosition ?
					<div className='fixed context-menu-panel' style={{ left: contextMenuStartPosition.x + 'px', top: contextMenuStartPosition.y + 'px' }}>
						<Menu className={'context-menu'} onClickMenuItem={(key) => {
							if (key === 'delete') {
								imgMark.current?.getShapePlugin()?.removeNode(tmpShape.current!)
							} else if (key === 'edit_label') {
								editShapeLabel()
							} else if (key === 'edit_category') {
								editShapeCategory()
							} else if (key === 'delete_all') {
								imgMark.current?.getShapePlugin()?.removeAllNodes()
							} else if (key === 'set_img_src') {
								changeSrc()
							}
							hideContextMenu()
						}}>
							{
								contextType === 'shape' ?
									<>
										<Menu.Item key={'edit_label'} >
											<IconFont type='icon-edit' style={{ color: iconColor, fontSize: '16px' }} />
											Edit Label
										</Menu.Item>
										<Menu.Item key={'edit_category'} >
											<IconFont type='icon-flag' style={{ color: iconColor, fontSize: '16px' }} />
											Edit Category
										</Menu.Item>
										<Menu.Item key={'delete'}>
											<IconFont type='icon-del' style={{ color: iconColor, fontSize: '18px' }} />
											Delete
										</Menu.Item>
									</>
									: null
							}
							{
								contextType == 'container' ?
									<>
										<Menu.Item key={'set_img_src'}>
											<IconFont type="icon-laiyuan" style={{ fontSize: '13px', color: iconColor }} />
											Set Img Src
										</Menu.Item>
										<Menu.Item key={'delete_all'}>
											<IconFont type='icon-del' style={{ color: iconColor, fontSize: '18px' }} />
											Delete All
										</Menu.Item>
									</>
									: null
							}
						</Menu>
					</div>
					: null
			}
		</div>
	)
}


export function getCategoryColor(category: CategoryItem) {
	return createColor(md5(category.category_id + category.name), {
		format: 'hex',
	})
}
