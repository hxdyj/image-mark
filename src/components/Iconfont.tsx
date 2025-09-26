import { Icon } from '@arco-design/web-react'
import { IconProps } from '@arco-design/web-react/icon'
import { SVGProps } from 'react'

const InnerIconFont = Icon.addFromIconFontCn({
	src: '/iconfont.js',
})

export const IconFont = function (
	props?: SVGProps<unknown> & IconProps & React.RefAttributes<unknown>
) {
	return <InnerIconFont {...props} />
}
