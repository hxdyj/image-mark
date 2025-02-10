
export function SvgNestGroupTransform() {
	return (
		<div className="page-svg-mask-demo bg-[#e5e6eb] min-h-[100vh]">
			<svg width="800" height="800" className="bg-[#165DFF]">
				<g transform="matrix(1.8, 0, 0, 1.8, 100, 100)">
					<image href="/img/demo-parking.jpg" width="700" />
					<g transform="matrix(1.6, 0, 0, 1.6, 0, 0)" opacity={0.5}>
						<circle cx={0} cy={0} r={10} fill="yellow" />
					</g>
					<g transform="matrix(0.5, 0, 0, 0.5, 100, 100)">
						<circle cx={0} cy={0} r={10} fill="red" opacity={0.8} />
					</g>
					<g transform="matrix(1, 0, 0, 1, 100, 100)">
						<circle cx={0} cy={0} r={10} fill="green" opacity={0.5} />
					</g>
					<g transform="matrix(1, 0, 0, 1, 200, 200)">
						<rect width={100} height={50} fill="pink" opacity={0.8}></rect>
					</g>
				</g>
			</svg>
		</div>
	)
}
