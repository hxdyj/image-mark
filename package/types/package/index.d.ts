import { ShapeData } from './shape/Shape';
import { RectData } from './shape/Rect';

export declare enum EventBusEventName {
    FirstRender = "firstRender"
}
export type ImageClient = {
    imageClientX: number;
    imageClientY: number;
};
export type Document2ContainerOffset = {
    _offsetX?: number;
    _offsetY?: number;
};
export type ArrayPoint = [number, number];
export type ArrayWH = ArrayPoint;
export type ContainerMouseEvent = MouseEvent & ImageClient & Document2ContainerOffset;
export type ContainerType = string | HTMLElement;
export type BoundingBox = Pick<RectData, "x" | "y" | "width" | "height">;
export type InitialScaleSize = 'fit' | 'original' | 'width' | 'height' | 'cover';
export type ImageMarkOptions = {
    el: ContainerType;
    src: string;
    initScaleConfig?: ({
        to?: 'image';
    } | {
        to: 'box';
        box: BoundingBox;
    }) & {
        startPosition?: 'center' | 'top-left';
        size?: InitialScaleSize;
        /**
         * 留白
         *  */
        padding?: number;
        paddingUnit?: 'px' | '%';
    };
    data?: ShapeData[];
};
export declare class ImageMark {
    private options;
    private container;
    private containerRectInfo;
    private stage;
    private stageGroup;
    private node2ShapeInstanceWeakMap;
    private data;
    private image;
    private imageDom;
    private lastTransform;
    private status;
    private minScale;
    private maxScale;
    private movingStartPoint;
    private eventBus;
    constructor(options: ImageMarkOptions);
    private init;
    private draw;
    private render;
    private crateDataShape;
    private getInitialScaleAndTranslate;
    private drawImage;
    private addDefaultAction;
    private removeDefaultAction;
    private onContainerWheel;
    addContainerEvent(): this;
    removeContainerEvent(): this;
    private onComtainerLmbDownMoveingMouseDownEvent;
    private onComtainerLmbDownMoveingMouseMoveEvent;
    private onComtainerLmbDownMoveingMouseUpEvent;
    addStageLmbDownMoveing(): this;
    removeStageLmbDownMoveing(): this;
    private onComtainerMouseWheelEvent;
    addStageMouseScale(): this;
    removeStageMouseScale(): this;
    moveSuccessive(point: ArrayPoint): this | undefined;
    endSuccessiveMove(): this;
    startSuccessiveMove(point: ArrayPoint): this;
    move(point: ArrayPoint): this | undefined;
    scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image', newScale?: number): this | undefined;
    private documentMouseEvent2EnhanceEvent;
    private getEventOffset;
    private containerMouseEvent2EnhanceEvent;
    private containerPoint2ImagePoint;
    setMinScale(minScale: number | InitialScaleSize): this;
    setMaxScale(maxScale: number | InitialScaleSize): this;
    on(...rest: any): this;
    scaleTo(options: ImageMarkOptions['initScaleConfig'], point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image'): void;
}
