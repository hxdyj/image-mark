declare module "@svgdotjs/svg.js" {
	interface Element {
		unpoint(x: number, y: number): import('@svgdotjs/svg.js').Point;
	}
}
