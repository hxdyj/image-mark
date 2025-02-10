import { Outlet } from 'react-router-dom'
import { Layout as ArcoLayout } from '@arco-design/web-react'
import { LeftMenuList } from './components/LeftMenuList/LeftMenuList'
import { Suspense, useState } from 'react'
const Sider = ArcoLayout.Sider
const ArcoHeader = ArcoLayout.Header
const Content = ArcoLayout.Content
import './Layout.scss'
export function Layout() {
	const [collapse, setCollapse] = useState(false)
	return (
		<ArcoLayout className="w-full h-full comp-layout">
			<ArcoLayout className="h-full relative">
				<Sider collapsed={collapse} style={{ width: collapse ? '48px' : '250px' }}>
					<LeftMenuList collapse={collapse} setCollapse={setCollapse} />
				</Sider>
				<ArcoLayout className={'layout-right'}>
					<ArcoLayout className={'layout-main'}>
						<Content className="layout-content px-[16px] pb-[16px] box-border " style={{ backgroundColor: `var(--by-color-gray-bg)` }}>
							<Outlet />
						</Content>
					</ArcoLayout>
				</ArcoLayout>
			</ArcoLayout>
		</ArcoLayout>
	)
}
