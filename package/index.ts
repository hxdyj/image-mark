import { G, Image, MatrixExtract, SVG, Svg } from "@svgdotjs/svg.js";
import { getContainerInfo, getElement } from "./utils/dom";
import { ImageMarkShape, ShapeData, ShapeType } from "./shape/Shape";
import { ImageMarkRect, RectData } from "./shape/Rect";
import { ImageMarkImage, ImageData } from "./shape/Image";

export type ImageClient = {
    imageClientX: number,
    imageClientY: number
}

export type ArrayPoint = [number, number]
export type ContainerMouseEvent = MouseEvent & ImageClient
export type ContainerType = string | HTMLElement;
export type BoundingBox = Pick<RectData, "x" | "y" | "width" | "height">
export type ImageMarkOptions = {
    el: ContainerType
    src: string,
    scaleToCenter?: {
        box?: BoundingBox
        /**
         * 留白 数值应该在0 - 1之间，按照百分比去算的
         *  */
        padding?: number
    }
    data?: ShapeData[]
}

export class ImageMark {
    private container: HTMLElement;
    private containerRectInfo: ReturnType<typeof getContainerInfo>;
    private stage: Svg;
    private stageGroup: G;
    private node2ShapeInstanceWeakMap = new WeakMap<ShapeData, ImageMarkShape>()
    private data: ShapeData[] = []
    private image: Image
    private imageDom: HTMLImageElement
    private lastTransform: MatrixExtract = {}
    constructor(private options: ImageMarkOptions) {
        this.data = options.data || []
        this.container = getElement(this.options.el)
        if (!this.container) {
            throw new Error('Container not found')
        }

        this.container.style.overflow = 'hidden'
        this.containerRectInfo = getContainerInfo(this.container)
        this.init()
        this.stage = SVG()
        this.stageGroup = new G()

        this.image = new Image()
        this.imageDom = document.createElement('img')
        this.image.load(this.options.src, (ev) => {
            this.imageDom = ev.target as HTMLImageElement
            this.stageGroup.addTo(this.stage)
            this.drawImage(ev)
            this.draw()
            this.render()
            this.addStageMouseScale()
        })
    }

    private init() {
        this.crateDataShape()
    }

    private draw() {
        this.stage.size(this.containerRectInfo.width, this.containerRectInfo.height)
        this.data.forEach(node => {
            const shape = this.node2ShapeInstanceWeakMap.get(node)
            if (shape) {
                shape.render(this.stageGroup)
            }
        })
    }

    private render() {
        this.stage.addTo(this.container)
    }

    private crateDataShape() {
        this.data.forEach(node => {
            if (!this.node2ShapeInstanceWeakMap.has(node)) {
                let shape = null
                if (node.type === ShapeType.Rect) {
                    shape = new ImageMarkRect(node as RectData)
                }
                if (node.type === ShapeType.Image) {
                    shape = new ImageMarkImage(node as ImageData)
                }
                if (shape) {
                    this.node2ShapeInstanceWeakMap.set(node, shape)
                }
            }
        })
    }

    private drawImage(ev: Event) {
        let target = ev.target as HTMLImageElement
        let imgWidth = target.naturalWidth
        let imgHeight = target.naturalHeight
        let containerWidth = this.containerRectInfo.width
        let containerHeight = this.containerRectInfo.height
        let { padding = 0, box } = this.options?.scaleToCenter ?? {}
        if (this.options?.scaleToCenter) {
            let paddingWidth = containerWidth * padding
            let paddingHeight = containerHeight * padding

            let maxWidth = containerWidth - paddingWidth * 2
            let maxHeight = containerHeight - paddingHeight * 2
            if (box) {//如果有box，就按照box的长宽比例展示图片
                let boxWidth = box.width
                let boxHeight = box.height
                let boxFitScale = maxWidth / maxHeight > boxWidth / boxHeight ? maxHeight / boxHeight : maxWidth / boxWidth // 长边尽量展示出来
                this.stageGroup.transform({
                    scale: boxFitScale,
                    translate: [(containerWidth - boxWidth * boxFitScale) / 2 - box.x * boxFitScale, (containerHeight - boxHeight * boxFitScale) / 2 - box.y * boxFitScale]
                })

            } else {//就是按照图片的长宽比例展示图片
                let widthRate = maxWidth / imgWidth
                let heightRate = maxHeight / imgHeight
                let imageFitScale = maxWidth / maxHeight > imgWidth / imgHeight ? heightRate : widthRate // 长边尽量展示出来
                this.stageGroup.transform({
                    scale: imageFitScale,
                    translate: [(containerWidth - imgWidth * imageFitScale) / 2, (containerHeight - imgHeight * imageFitScale) / 2]
                })
            }
        }
        this.lastTransform = this.stageGroup.transform()

        this.image.size(target.naturalWidth, target.naturalHeight)
        this.image.addTo(this.stageGroup)
    }


    private addStageMouseScale() {
        this.stage.on('wheel', (ev: Event) => {
            let e = ev as WheelEvent
            let enhanceEvt = this.mouseEvent2ContainerEvent(e)
            this.scale(e.deltaY < 0 ? 1 : -1, [enhanceEvt.imageClientX, enhanceEvt.imageClientY], 'image')
        })
    }

    scale(direction: 1 | -1, point: ArrayPoint | 'left-top' | 'center', reletiveTo: 'container' | 'image' = 'container') {
        if (point === 'left-top') {
            point = [0, 0]
        }
        if (point === 'center') {
            point = [this.imageDom.naturalWidth / 2, this.imageDom.naturalHeight / 2]
        }
        let origin = point

        const zoomIntensity = 0.1
        let zoom = Math.exp(direction * zoomIntensity)

        if (reletiveTo === 'container') {
            origin = this.containerPoint2ImagePoint(point)
        }
        this.stageGroup.transform({
            origin,
            scale: zoom,
        }, true)

        this.lastTransform = this.stageGroup.transform()
    }

    private mouseEvent2ContainerEvent(event: MouseEvent): ContainerMouseEvent {
        const cloneEvent = event as ContainerMouseEvent
        const newPoint = this.containerPoint2ImagePoint([cloneEvent.offsetX, cloneEvent.offsetY])
        cloneEvent.imageClientX = newPoint[0]
        cloneEvent.imageClientY = newPoint[1]
        return cloneEvent
    }

    private containerPoint2ImagePoint(point: ArrayPoint): ArrayPoint {
        let newX = (point[0] - this.lastTransform.translateX!) / this.lastTransform.scaleX!
        let newY = (point[1] - this.lastTransform.translateY!) / this.lastTransform.scaleY!
        return [newX, newY]
    }
}

