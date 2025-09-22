import { ReactProps } from '../types/ReactProps'
import './OperateGroup.scss'
export function OperateGroup(props: ReactProps & {
	desc?: string,
}) {
	return (
		<div className="comp-operate-group">
			<div className='desc'>{props.desc}</div>
			<div className='flex flex-col gap-y-4'>
				{
					props.children
				}
			</div>
		</div>
	)
}
