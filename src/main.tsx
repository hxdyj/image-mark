import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import './index.scss'
import { ComponentConfig } from '@arco-design/web-react/es/ConfigProvider/interface'
import { ConfigProvider } from '@arco-design/web-react';

const componentConfig: ComponentConfig = {
	Button: {
		type: 'primary',
	},
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ConfigProvider componentConfig={componentConfig}>
			<RouterProvider router={router}></RouterProvider>
		</ConfigProvider>
	</React.StrictMode>
)
