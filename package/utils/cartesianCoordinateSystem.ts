import { Point } from "@svgdotjs/svg.js";
import { ArrayPoint, BoundingBox, EdgeName } from "..";
import { areNumberEqual } from "./number";

export type RectVertexPoints = {
	[key in EdgeName]: ArrayPoint
}
/**
 * 通过origin和rect找到与x轴、y轴交点的坐标，这个方法只适用于origin在rect内部的情况
 *  */
export function getPointDoXaxisYaxisIntersectWithRect(point: ArrayPoint, rect: BoundingBox): RectVertexPoints {
	let top: ArrayPoint = [point[0], rect.y]
	let bottom: ArrayPoint = [point[0], rect.y + rect.height]
	let left: ArrayPoint = [rect.x, point[1]]
	let right: ArrayPoint = [rect.x + rect.width, point[1]]

	return {
		top,
		bottom,
		left,
		right,
	}
}


export function twoPointsDistance(point1: ArrayPoint, point2: ArrayPoint): number {
	return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
}


export function getRectWeltContainerEdgeNameList(current: BoundingBox, container: BoundingBox): EdgeName[] {
	const result: EdgeName[] = [];

	if (areNumberEqual(current.x, container.x)) {
		result.push('left');
	}
	if (areNumberEqual(current.x + current.width, container.x + container.width)) {
		result.push('right');
	}
	if (areNumberEqual(current.y, container.y)) {
		result.push('top');
	}
	if (areNumberEqual(current.y + current.height, container.y + container.height)) {
		result.push('bottom');
	}

	return result;
}


export function sortEdgeNames(edges: EdgeName[]): EdgeName[] {
	const priority: Record<EdgeName, number> = {
		left: 0,
		right: 1,
		top: 2,
		bottom: 3
	};
	return edges.sort((a, b) => priority[a] - priority[b]);
}


export function unitVector(point1: Point, point2: Point) {
	const d = twoPointsDistance([point1.x, point1.y], [point2.x, point2.y])
	return new Point((point2.x - point1.x) / d, (point2.y - point1.y) / d)
}
