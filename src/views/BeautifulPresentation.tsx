import React, { useEffect, useRef, useState } from 'react'
import './BeautifulPresentation.scss'
import { ShapeData, ShapeOptions } from '#/shape/Shape'
import { ImageMarkShape } from '../../package/shape/Shape';
import ImageMark, { EventBusEventName, ShapePlugin } from '#/index';
import { demoData } from '../data/fullDemo.data';
import { Badge, Button, Drawer, Form, Radio } from '@arco-design/web-react';
import { IconFont } from '../components/Iconfont';
import { IconRedo, IconUndo } from '@arco-design/web-react/icon';
const iconColor = `#111`
export function BeautifulPresentation() {
	let imgMark = useRef<ImageMark | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const drawerTargetRef = useRef<HTMLDivElement>(null)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [readonly, setReadonly] = useState(false)
	const [historyStackInfo, setHistoryStackInfo] = useState<{ undo: number, redo: number }>({
		undo: 0,
		redo: 0
	})

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
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhidian" style={{ fontSize: '18px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhixian2" style={{ fontSize: '26px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-quxian-" style={{ fontSize: '22px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhixianduan" style={{ fontSize: '26px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-huizhimian1" style={{ fontSize: '20px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-polygon" style={{ fontSize: '17px', color: iconColor }} />} />
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-tuxinghuizhi" style={{ fontSize: '18px', color: iconColor }} />} />
					</div>
					<div className='flex items-center gap-x-2'>
						<Badge
							dotClassName="history-badge"
							count={historyStackInfo?.undo}>
							<Button className={'icon-btn'} type={historyStackInfo?.undo ? 'primary' : 'text'} icon={<IconUndo style={{ fontSize: '18px', color: historyStackInfo?.undo ? 'white' : iconColor }} />} onClick={() => {
								imgMark?.current?.getHistoryPlugin()?.undo()
							}} />
						</Badge>
						<Badge
							dotClassName="history-badge"
							count={historyStackInfo?.redo}>
							<Button className={'icon-btn'} type={historyStackInfo?.redo ? 'primary' : 'text'} icon={<IconRedo style={{ fontSize: '18px', color: historyStackInfo?.redo ? 'white' : iconColor }} />} onClick={() => {
								imgMark?.current?.getHistoryPlugin()?.redo()
							}} />

						</Badge>
					</div>
					<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-del" style={{ fontSize: '20px', color: iconColor }} />} onClick={() => {
						imgMark?.current?.getShapePlugin()?.removeAllNodes()
					}} />
				</div>
				<div>
					<div className='flex items-center gap-x-6'>
						<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-chakanshuju" style={{ fontSize: '22px', color: iconColor }} />} />
						<div className='flex items-center gap-x-2'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale-" style={{ fontSize: '22px', color: iconColor }} />} />
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-scale_plus" style={{ fontSize: '22px', color: iconColor }} />} />
						</div>
						<div className='flex items-center gap-x-2'>
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-kuaijiejian" style={{ fontSize: '18px', color: iconColor }} />} />
							<Button className={'icon-btn'} type='text' icon={<IconFont type="icon-weixuanzhongbeifen" style={{ fontSize: '15px', color: iconColor }} />} onClick={() => {
								setDrawerVisible(true)
							}} />
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
					<Form.Item label="Select Mode" field={'selectMode'}>
						<Radio.Group type='button'>
							<Radio value={1}>Single</Radio>
							<Radio value={2}>Multiple</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="Readonly" field={'readonly'}>
						<Radio.Group type='button'>
							<Radio value={1}>On</Radio>
							<Radio value={2}>Off</Radio>
						</Radio.Group>
					</Form.Item>
				</Form>
			</Drawer>
		</div>
	)
}
