import { Icon } from '@arco-design/web-react'
import { IconProps } from '@arco-design/web-react/icon'
import { SVGProps } from 'react'

const InnerIconFont = Icon.addFromIconFontCn({
	src: '//at.alicdn.com/t/c/font_4667243_4u3r1unko56.js',
})

export const IconFont = function (
	props?: SVGProps<unknown> & IconProps & React.RefAttributes<unknown>
) {
	return <InnerIconFont {...props} />
}
