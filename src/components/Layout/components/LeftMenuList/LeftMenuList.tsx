import { Avatar, Dropdown, Form, Input, Menu, Message, Modal } from '@arco-design/web-react'
import './LeftMenuList.scss'
import { IRoute, LAYOUT_ROUTE } from '../../../../router/router'
import { useNavigate } from 'react-router-dom'
import { IconFont } from '../../../Iconfont'
import { useState } from 'react'
//TODO(songle): 申明
import logo from './logo.svg'
export interface ReactProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}


const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
function recursionCreateMenuTree(
	routes: IRoute[] = [],
	result: IRoute[] = [],
	level = 0
) {
	routes.forEach(route => {
		if (route.meta?.menuShow) {
			route.meta.level = level
			const permissionFlag =
				route.meta.permission === void 0 ||
				(route.meta.permission)
			if (permissionFlag) {
				route.children = recursionCreateMenuTree(route.children, [], level + 1)
				result.push(route)
			}
		}
	})
	return result
}


export function MenuContentWrapper(props: ReactProps & {
	collapse: boolean,
}) {
	return <div className='flex items-center h-[40px]'>
		{
			props?.children
		}
	</div>
}

export function LeftMenuList(props: {
	collapse: boolean,
	setCollapse: (flag: boolean) => void
}
) {

	const [visible, setVisible] = useState(false)

	const navigate = useNavigate()
	let menuList = recursionCreateMenuTree(LAYOUT_ROUTE?.children)
	function recursionGetMenuTree(routeTree: IRoute[]) {
		return routeTree.map(route => {
			let isNoneSon = !route.children || route.children.length === 0
			let isSingleSon = route.children?.length === 1
			if (isNoneSon)
				return (
					<MenuItem key={route.path!}>
						<MenuContentWrapper collapse={props.collapse}>
							{route.meta?.icon}
							<span>{route?.meta?.title}</span>
						</MenuContentWrapper>
					</MenuItem>
				)
			if (isSingleSon) {
				let subNode = route.children![0]
				return (
					<MenuItem key={subNode.path!}>
						<MenuContentWrapper collapse={props.collapse}>
							{subNode.meta?.icon}
							<span>{subNode?.meta?.title}</span>
						</MenuContentWrapper>
					</MenuItem>
				)
			}
			return (
				<SubMenu
					key={route.path!}
					title={
						<>
							<MenuContentWrapper collapse={props.collapse}>
								{route.meta?.icon}
								<span>{route?.meta?.title}</span>
							</MenuContentWrapper>
						</>
					}
				>
					{recursionGetMenuTree(route.children || [])}
				</SubMenu>
			)
		})
	}
	function onClickMenuItem(key: string, event: any, keyPath: string[]) {
		if (key === location.pathname) return
		setSelectKeys([key])
		navigate(key)
	}

	const [selectKeys, setSelectKeys] = useState([location.pathname])

	return (
		<Menu
			className={'comp_left_menu_list'}
			hasCollapseButton
			autoOpen
			autoScrollIntoView
			defaultOpenKeys={['/prepare']}
			selectedKeys={selectKeys}
			onClickMenuItem={onClickMenuItem}
			onCollapseChange={flag => {
				props.setCollapse(flag)
			}}
			style={{ userSelect: 'none' }}
		>
			<div className='logo-panel flex-col'>
				<img src={logo} alt='logo' className=' w-[130px]' />
				<div className=' font-bold'>
					Image Mark
				</div>
			</div>
			<div className='menu-panel'>
				{recursionGetMenuTree(menuList)}
			</div>
		</Menu>
	)
}
