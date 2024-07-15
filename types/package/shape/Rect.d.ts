import { ShapeData } from './Shape';
import { BoundingBox } from '..';

export interface RectData extends BoundingBox, ShapeData {
    shapeName: "rect";
}
