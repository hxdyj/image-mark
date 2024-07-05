import { ContainerType } from ".."


export function getElement(el: ContainerType): HTMLElement {
    if (typeof el === 'string') {
        return document.querySelector(el) as HTMLElement
    }
    return el
}

export function getContainerInfo(el: ContainerType) {
    let ele = getElement(el)
    let containerRectInfo = ele.getBoundingClientRect()
    const containerInfo = {
        top: containerRectInfo.top,
        right: containerRectInfo.right,
        bottom: containerRectInfo.bottom,
        left: containerRectInfo.left,
        width: containerRectInfo.width,
        height: containerRectInfo.height,
        x: containerRectInfo.x,
        y: containerRectInfo.y,
    }
    return containerInfo
}