import Color from "color";

export function getOptimalTextColor(backgroundColor: string) {
	const bg = Color(backgroundColor);
	const bgHsl = bg.hsl().object();
	// 计算互补色（色相旋转180°）
	let complementaryHue = (bgHsl.h + 180) % 360;

	// 根据背景亮度智能调整互补色亮度
	let textLightness;
	if (bgHsl.l < 30) {
		// 背景很暗：使用较亮的文字
		textLightness = 80;
	} else if (bgHsl.l > 70) {
		// 背景很亮：使用较暗的文字
		textLightness = 20;
	} else {
		// 背景中等亮度：使用与背景有明显对比的亮度
		textLightness = bgHsl.l > 50 ? 20 : 80;
	}
	return Color({ h: complementaryHue, s: 70, l: textLightness }).toString();
}

export function darkenColor(color: string, percent: number) {
	return Color(color).darken(percent / 100).toString();
}
