import { Plugin } from './plugin';
import { ImageMark } from '../index';
export type MinimapPluginOptions = {
    size?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    padding?: number;
    border?: {
        width?: number;
        color?: string;
    };
    background?: string;
    viewportStyle?: {
        stroke?: string;
        strokeWidth?: number;
        fill?: string;
    };
    shapeStyle?: {
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
    };
    opacity?: number;
    constrainToImage?: boolean;
};
export declare class MinimapPlugin extends Plugin {
    pluginOptions?: MinimapPluginOptions | undefined;
    static pluginName: string;
    static pluginOptions: MinimapPluginOptions;
    private minimapContainer?;
    private minimapCanvas?;
    private minimapCtx?;
    private minimapWidth;
    private minimapHeight;
    private scale;
    private isDragging;
    private rafId;
    private lastTransform;
    private wasMainCanvasMoving;
    constructor(imageMarkInstance: ImageMark, pluginOptions?: MinimapPluginOptions | undefined);
    bindEvent(): void;
    unbindEvent(): void;
    onFirstRender: () => void;
    private init;
    /**
     * 启动 transform 变化检查（用于检测画布移动）
     */
    private startTransformCheck;
    /**
     * 停止 transform 变化检查
     */
    private stopTransformCheck;
    private createMinimapDOM;
    private calculateMinimapSize;
    private updateMinimap;
    private drawImage;
    private drawShapes;
    private drawViewport;
    /**
     * 获取当前视口在 minimap 中的位置和大小
     */
    private getViewportRect;
    /**
     * 将 minimap 上的点击位置转换为图片坐标系中的位置
     */
    private minimapPointToImagePoint;
    /**
     * 检查是否需要限制视口在图片范围内
     */
    private shouldConstrainToImage;
    /**
     * 移动主画布使视口中心对齐到指定的图片坐标
     */
    private moveViewportTo;
    private onCanvasMouseDown;
    private onCanvasContextMenu;
    private onDocumentMouseMove;
    private onDocumentMouseUp;
    onRerender: () => void;
    onScale: () => void;
    onShapeUpdate: () => void;
    onShapeAdd: () => void;
    onShapeDelete: () => void;
    onShapePluginDataChange: () => void;
    destroy(): void;
}
