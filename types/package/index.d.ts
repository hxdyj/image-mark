import { G, Image, MatrixAlias, MatrixExtract, Svg } from '@svgdotjs/svg.js';
import { getContainerInfo } from './utils/dom';
import { default as EventEmitter } from 'eventemitter3';
import { Plugin } from './plugins/plugin';
import { EventBindingThis } from './event/event';
import { ShapePlugin } from './plugins/ShapePlugin';
import { SelectionPlugin } from './plugins/SelectionPlugin';
export type TransformStep = [MatrixAlias, boolean];
export declare const POSITION_LIST: readonly ["left-top", "right-top", "left-bottom", "right-bottom", "top", "bottom", "left", "right", "center"];
export type Position = typeof POSITION_LIST[number];
export type OutOfData = [boolean, number];
export type ArrayPoint = [number, number];
export type ArrayWH = ArrayPoint;
export type ContainerType = string | HTMLElement;
export type PluginNewCall = (imageMarkInstance: ImageMark) => Plugin;
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
export type StartPosition = 'center' | 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom';
export type ImageMarkOptions = {
    el: ContainerType;
    src: string;
    initScaleConfig?: ({
        to?: 'image';
    } | {
        to: 'box';
        box: BoundingBox;
    }) & {
        startPosition?: StartPosition;
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
export declare class ImageMarkManager {
    imageMarkEleInstanceWeakMap: WeakMap<HTMLElement, ImageMark>;
    idInstanceMap: Map<string, ImageMark>;
    addNewInstance(instance: ImageMark): void;
    removeInstance(instance: ImageMark): void;
    unusePlugin(plugin: typeof Plugin): void;
}
export declare const imageMarkManager: ImageMarkManager;
export type ImageMarkStatus = {
    scaling: boolean;
    moving: boolean;
    drawing: boolean | string;
};
export declare class ImageMark extends EventBindingThis {
    options: ImageMarkOptions;
    id: string;
    container: HTMLElement;
    containerRectInfo: ReturnType<typeof getContainerInfo>;
    stage: Svg;
    stageGroup: G;
    image: Image;
    imageDom: HTMLImageElement;
    plugin: {
        [key: string]: Plugin;
    };
    status: ImageMarkStatus;
    minScale: number;
    maxScale: number;
    movingStartPoint: ArrayPoint | null;
    eventBus: EventEmitter<string | symbol, any>;
    private destroyed;
    createTime: number;
    constructor(options: ImageMarkOptions);
    protected init(action?: 'rerender'): void;
    protected initVariable(): void;
    getCurrentScale(): number;
    resize(): void;
    rerender(): void;
    destroy(): void;
    protected draw(): void;
    protected removeContainerRenderItems(): void;
    protected render(): void;
    protected getInitialScaleAndTranslate(options: ImageMarkOptions['initScaleConfig']): {
        scale: number;
        translate: ArrayPoint;
    };
    protected checkMinScaleValidate(): boolean;
    protected checkInitOutOfContainerAndReset(): void;
    protected drawImage(ev: Event | null, size?: 'initial' | 'reserve', addTo?: boolean): void;
    static useDefaultPlugin(): void;
    static unuseDefaultPlugin(): void;
    addDefaultAction(): void;
    removeDefaultAction(): void;
    protected onContainerWheel(e: Event): void;
    protected onContainerDragLeaveEvent(e: DragEvent): void;
    protected onContainerDropEvent(e: DragEvent): void;
    protected onContainerDragEnterEvent(e: DragEvent): void;
    protected onContainerDragOverEvent(e: DragEvent): void;
    protected containerResizeObserverCallback: ResizeObserverCallback;
    protected onLoadImageError(e: Event): void;
    protected containerResizeObserver: ResizeObserver;
    protected bindEvent(): this;
    protected unbindEvent(): this;
    onComtainerLmbDownMoveingMouseDownEvent(e: Event): void;
    protected onComtainerLmbDownMoveingMouseMoveEvent: import('lodash').DebouncedFuncLeading<(e: Event) => void>;
    protected onComtainerLmbDownMoveingMouseUpEvent(e: Event): void;
    addStageLmbDownMoveing(): this;
    removeStageLmbDownMoveing(): this;
    protected onComtainerMouseWheelEvent(ev: Event): void;
    addStageMouseScale(): this;
    removeStageMouseScale(): this;
    protected limitMovePoint(movePoint: ArrayPoint): ArrayPoint;
    protected fixPoint(point: ArrayPoint, fixPoint: ArrayPoint): ArrayPoint;
    moveTo(position: Position): void;
    move(point: ArrayPoint): this | undefined;
    movingStartTransform: MatrixExtract | null;
    startSuccessiveMove(point: ArrayPoint): this | undefined;
    moveSuccessive(point: ArrayPoint): this | undefined;
    endSuccessiveMove(): this;
    protected checkScaleLimitImageInContainer(point: ArrayPoint, callback?: (nextGroup: G) => void): this | null;
    scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image', newScale?: number): this | undefined;
    protected containerPoint2ImagePoint(point: ArrayPoint): ArrayPoint;
    setMinScale(minScale: number | InitialScaleSize): this;
    setMaxScale(maxScale: number | InitialScaleSize): this;
    on(...rest: any): this;
    off(...rest: any): this;
    scaleTo(options: ImageMarkOptions['initScaleConfig'], point: ArrayPoint | 'left-top' | 'center', reletiveTo?: 'container' | 'image'): void;
    setEnableImageOutOfContainer(enable: boolean): this;
    protected cloneGroup(transform?: MatrixExtract): G;
    protected getImageBoundingBoxByTransform(transform: MatrixExtract): EnhanceBoundingBox;
    protected getScaleLimitImageInContainerInfo(scaleOrigin: ArrayPoint, currentTransform: MatrixExtract, nextStepTransform: MatrixExtract): Array<[MatrixAlias, boolean]> | null | false;
    protected getOutOfContainerEdgeList(directionOutOfInfo: DirectionOutOfInfo): EdgeName[];
    protected isOutofContainer(nextStepTransform: MatrixExtract): {
        isOutOf: boolean;
        directionOutOfInfo: DirectionOutOfInfo;
    };
    getShapePlugin(): ShapePlugin | null;
    getSelectionPlugin(): SelectionPlugin | null;
    addPlugin(plugin: typeof Plugin | PluginNewCall): this;
    removePlugin(plugin: typeof Plugin): this;
    initPlugin(plugin: typeof Plugin | PluginNewCall): this;
    static pluginList: Array<typeof Plugin>;
    static usePlugin(plugin: typeof Plugin): typeof ImageMark;
    static unusePlugin(plugin: typeof Plugin, currentInstanceRemove?: boolean): typeof ImageMark;
    static hasPlugin(plugin: typeof Plugin): typeof Plugin | undefined;
}
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
};
export default ImageMark;
export * from './action';
export * from './event';
export * from './plugins';
export * from './shape';
