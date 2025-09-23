import { Point } from '@svgdotjs/svg.js';
import { ArrayPoint, BoundingBox, EdgeName } from '..';
export type RectVertexPoints = {
    [key in EdgeName]: ArrayPoint;
};
/**
 * 通过origin和rect找到与x轴、y轴交点的坐标，这个方法只适用于origin在rect内部的情况
 *  */
export declare function getPointDoXaxisYaxisIntersectWithRect(point: ArrayPoint, rect: BoundingBox): RectVertexPoints;
export declare function twoPointsDistance(point1: ArrayPoint, point2: ArrayPoint): number;
export declare function getRectWeltContainerEdgeNameList(current: BoundingBox, container: BoundingBox): EdgeName[];
export declare function sortEdgeNames(edges: EdgeName[]): EdgeName[];
export declare function unitVector(point1: Point, point2: Point): Point;
