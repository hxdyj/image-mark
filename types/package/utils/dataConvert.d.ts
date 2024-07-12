import { BoundingBox } from '..';

export type Point = {
    x: number;
    y: number;
};
export type RectFourPoints = {
    lt: Point;
    rt: Point;
    rb: Point;
    lb: Point;
};
export declare function boundingBox2RectFourPoints(box: BoundingBox): RectFourPoints;
