export function SvgMaskDemo() {
	return (
		<div className="page-svg-mask-demo bg-[#e5e6eb] min-h-[100vh]">
			<svg width="800" height="800" className="bg-[#165DFF]">
				<image href="/demo-parking.jpg" width="700" />
				<mask id="myMask">
					{/* 白色像素下的所有内容都将可见 */}
					<rect x="0" y="0" width="700" height="526" fill="white" />
					{/* 黑色像素下的所有内容都将不可见 */}
					<rect x="200" y="200" width="200" height="100" fill="black" />
				</mask>
				<rect x="0" y="0" width="800" height="800" fill="black" opacity={0.4} mask="url(#myMask)" />
				<rect x="200" y="200" width="200" height="100" fill="transparent" stroke="yellow" />
			</svg>

		</div>
	)
}
