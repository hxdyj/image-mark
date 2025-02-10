
export function SvgNestDemo() {
	return (
		<div className="page-svg-mask-demo bg-[#e5e6eb] min-h-[100vh]">
			<svg width="800" height="800" className="bg-[#165DFF]">
				<svg width="200" height="200" transform="translate(100,100)">
					<rect x="0" y="0" width="200" height="100" fill="red" stroke="yellow" />
				</svg>
			</svg>
		</div>
	)
}
