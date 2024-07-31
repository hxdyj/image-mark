import { Shape } from "@svgdotjs/svg.js";
import { ArrayPoint } from "..";

export function bbox2twoPoints(shape: Shape): ArrayPoint[] {
	const box = shape.bbox()
	return [[box.x, box.y], [box.x + box.width, box.y + box.height]]
}
