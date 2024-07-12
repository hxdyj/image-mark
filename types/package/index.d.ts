import { G, Image, MatrixAlias, MatrixExtract, Svg } from '@svgdotjs/svg.js';
import { getContainerInfo } from './utils/dom';
import { default as EventEmitter } from 'eventemitter3';
import { Plugin } from './plugins';
import { EventBindingThis } from './event';

export declare enum EventBusEventName {
    init = "init",
    first_render = "first_render",
    rerender = "rerender",
    draw = "draw",
    container_drag_over = "container_drag_over",
    container_drag_leave = "container_drag_leave",
    container_drop = "container_drop"
}
export type TransformStep = [MatrixAlias, boolean];
export type ImageClient = {
    imageClientX: number;
    imageClientY: number;
};
export type Document2ContainerOffset = {
    _offsetX?: number;
    _offsetY?: number;
};
export type OutOfData = [boolean, number];
export type ArrayPoint = [number, number];
export type ArrayWH = ArrayPoint;
export type ContainerMouseEvent = MouseEvent & ImageClient & Document2ContainerOffset;
export type ContainerType = string | HTMLElement;
export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type EnhanceBoundingBox = BoundingBox & {
    endX: number;
    endY: number;
};
export type EdgeName = 'left' | 'right' | 'top' | 'bottom';
export type DirectionOutOfInfo = {
    [key in EdgeName]: OutOfData;
};
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
    moveConfig?: {};
    enableImageOutOfContainer?: boolean;
    pluginOptions?: {
        [key: string]: any;
    };
};
export declare class ImageMark extends EventBindingThis {
    options: ImageMarkOptions;
    container: HTMLElement;
    containerRectInfo: ReturnType<typeof getContainerInfo>;
    stage: Svg;
    stageGroup: G;
    image: Image;
    imageDom: HTMLImageElement;
    lastTransform: MatrixExtract;
    plugin: {
        [key: string]: Plugin;
    };
    status: {
        scaling: boolean;
        moving: boolean;
    };
    minScale: number;
    maxScale: number;
    movingStartPoint: ArrayPoint | null;
    eventBus: EventEmitter<string | symbol, any>;
    constructor(options: ImageMarkOptions);
    private initBindAllEventsThis;
    private init;
    rerender(): void;
    private draw;
    private render;
    private getInitialScaleAndTranslate;
    private checkMinScaleValidate;
    private checkInitOutOfContainerAndReset;
    private drawImage;
    private addDefaultAction;
    private removeDefaultAction;
    private onContainerWheel;
    private onContainerDragLeaveEvent;
    private onContainerDropEvent;
    private onContainerDragOverEvent;
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
    private limitMovePoint;
    private fixPoint;
    move(point: ArrayPoint): this | undefined;
    moveSuccessive(point: ArrayPoint): this | undefined;
    endSuccessiveMove(): this;
    startSuccessiveMove(point: ArrayPoint): this;
    scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image', newScale?: number): this | undefined;
    private documentMouseEvent2EnhanceEvent;
    private getEventOffset;
    private containerMouseEvent2EnhanceEvent;
    private containerPoint2ImagePoint;
    setMinScale(minScale: number | InitialScaleSize): this;
    setMaxScale(maxScale: number | InitialScaleSize): this;
    on(...rest: any): this;
    off(...rest: any): this;
    scaleTo(options: ImageMarkOptions['initScaleConfig'], point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image'): void;
    setEnableImageOutOfContainer(enable: boolean): this;
    private cloneGroup;
    private getImageBoundingBoxByTransform;
    private getScaleLimitImageInContainerInfo;
    private getOutOfContainerEdgeList;
    private isOutofContainer;
    addPlugin(plugin: typeof Plugin): void;
    removePlugin(plugin: typeof Plugin): void;
    initPlugin(plugin: typeof Plugin): void;
    static pluginList: Array<typeof Plugin>;
    static usePlugin(plugin: typeof Plugin): typeof ImageMark;
    static hasPlugin(plugin: typeof Plugin): typeof Plugin | undefined;
}
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
};
