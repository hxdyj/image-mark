import { BoundingBox } from ".."

export type Point = {
	x: number,
	y: number,
}

export type RectFourPoints = {
	lt: Point,
	rt: Point,
	rb: Point,
	lb: Point,
}

export function boundingBox2RectFourPoints(box: BoundingBox): RectFourPoints {
	return {
		lt: { x: box.x, y: box.y },
		rt: { x: box.x + box.width, y: box.y },
		rb: { x: box.x + box.width, y: box.y + box.height },
		lb: { x: box.x, y: box.y + box.height },
	}
}
