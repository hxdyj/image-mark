import { useNavigate, useRouteError } from 'react-router-dom'
import nProgress from 'nprogress'
import { Button, Empty } from '@arco-design/web-react'
import { IconFont } from '../../components/Iconfont'

export function AppError() {
	const navigate = useNavigate()

	const error: any = useRouteError()
	nProgress.done()
	const errorMsg = String(error?.message || '')
	console.log('errorMsg', errorMsg)
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<div className="w-[20%] w-min-[100px] relative top-[-15%]">
				<Empty
					icon={<IconFont style={{ fontSize: '90px' }} type="zanwuquanxian" />}
					description={
						<div>
							<p>
								{error?.message
									? {
										'permission deny': '暂无权限',
									}[errorMsg] || errorMsg
									: JSON.stringify(error)}
							</p>
							<Button
								className={'mt-4'}
								type="primary"
								onClick={() => {
									navigate(-1)
								}}
							>
								返回
							</Button>
						</div>
					}
				/>
			</div>
		</div>
	)
}
