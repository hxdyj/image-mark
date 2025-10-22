import { extend, Point, Element } from "@svgdotjs/svg.js";

export function unpoint(x: number, y: number) {
	//@ts-ignore
	return new Point(x, y).transformO(this.screenCTM())
}

extend(Element, {
	unpoint
})
