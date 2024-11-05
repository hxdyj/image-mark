import { ReactProps } from '../types/ReactProps'
import './OperateGroup.scss'
export function OperateGroup(props: ReactProps & {
	desc?: string,
}) {
	return (
		<div className="comp-operate-group">
			{
				props.children
			}
			<div className='desc text-center'>{props.desc}</div>
		</div>
	)
}
