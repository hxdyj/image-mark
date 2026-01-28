import { Plugin, PluginOptions } from './plugin';
import { ImageMark } from '../index';
import { EventBusEventName } from '../event/const';
import { MinimapDrawContext } from '../shape/Shape';

export type MinimapPluginOptions = {
	size?: number;  // minimap 的大小（宽度或高度的最大值）
	position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	padding?: number;  // 距离容器边缘的距离
	border?: {
		width?: number;
		color?: string;
	};
	background?: string;  // 背景色
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
	opacity?: number;  // minimap 整体透明度
	constrainToImage?: boolean;  // 在 minimap 操作时是否限制视口不超出图片范围，默认跟随 imageFullOfContainer
}

export class MinimapPlugin extends Plugin {
	static pluginName = 'minimap';
	static pluginOptions: MinimapPluginOptions = {
		size: 200,
		position: 'top-right',
		padding: 20,
		border: {
			width: 2,
			color: '#333'
		},
		background: 'rgba(255, 255, 255, 0.9)',
		viewportStyle: {
			stroke: '#FF7D00',
			strokeWidth: 2,
			fill: 'rgba(255, 125, 0, 0.1)'
		},
		shapeStyle: {
			fill: 'rgba(255, 125, 0, 0.3)',
			stroke: '#FF7D00',
			strokeWidth: 1
		},
		opacity: 1
	};

	private minimapContainer?: HTMLDivElement;
	private minimapCanvas?: HTMLCanvasElement;
	private minimapCtx?: CanvasRenderingContext2D;
	private minimapWidth: number = 0;
	private minimapHeight: number = 0;
	private scale: number = 1;  // minimap 相对于原图的缩放比例
	private isDragging: boolean = false;
	private rafId: number | null = null;  // requestAnimationFrame ID
	private lastTransform: string = '';  // 用于检测 transform 变化
	private wasMainCanvasMoving: boolean = false;  // 记录主画布是否正在移动

	constructor(
		imageMarkInstance: ImageMark,
		public pluginOptions?: MinimapPluginOptions
	) {
		super(imageMarkInstance, pluginOptions);
		this.bindEventThis([
			'onRerender',
			'onScale',
			'onShapeUpdate',
			'onShapeAdd',
			'onShapeDelete',
			'onShapePluginDataChange',
			'onCanvasMouseDown',
			'onDocumentMouseMove',
			'onDocumentMouseUp',
			'onFirstRender'
		]);
		this.bindEvent();
	}

	bindEvent(): void {
		super.bindEvent();
		this.imageMark.on(EventBusEventName.first_render, this.onFirstRender);
		this.imageMark.on(EventBusEventName.rerender, this.onRerender);
		this.imageMark.on(EventBusEventName.scale, this.onScale);
		this.imageMark.on(EventBusEventName.shape_update_data, this.onShapeUpdate);
		this.imageMark.on(EventBusEventName.shape_add, this.onShapeAdd);
		this.imageMark.on(EventBusEventName.shape_delete, this.onShapeDelete);
		this.imageMark.on(EventBusEventName.shape_plugin_data_change, this.onShapePluginDataChange);
	}

	unbindEvent(): void {
		super.unbindEvent();
		this.imageMark.off(EventBusEventName.first_render, this.onFirstRender);
		this.imageMark.off(EventBusEventName.rerender, this.onRerender);
		this.imageMark.off(EventBusEventName.scale, this.onScale);
		this.imageMark.off(EventBusEventName.shape_update_data, this.onShapeUpdate);
		this.imageMark.off(EventBusEventName.shape_add, this.onShapeAdd);
		this.imageMark.off(EventBusEventName.shape_delete, this.onShapeDelete);
		this.imageMark.off(EventBusEventName.shape_plugin_data_change, this.onShapePluginDataChange);

		if (this.minimapCanvas) {
			this.minimapCanvas.removeEventListener('mousedown', this.onCanvasMouseDown);
			this.minimapCanvas.removeEventListener('contextmenu', this.onCanvasContextMenu);
		}
		document.removeEventListener('mousemove', this.onDocumentMouseMove);
		document.removeEventListener('mouseup', this.onDocumentMouseUp);
	}

	onFirstRender = () => {
		this.init();
	};

	private init(): void {
		if (!this.imageMark.imageDom.complete || !this.imageMark.imageDom.naturalWidth) {
			// 图片还未加载完成，等待下次
			return;
		}

		this.createMinimapDOM();
		this.calculateMinimapSize();
		this.updateMinimap();
		this.startTransformCheck();
	}

	/**
	 * 启动 transform 变化检查（用于检测画布移动）
	 */
	private startTransformCheck(): void {
		const check = () => {
			if (!this.imageMark.stageGroup) {
				this.rafId = requestAnimationFrame(check);
				return;
			}

			const transform = this.imageMark.stageGroup.transform();
			const transformStr = JSON.stringify(transform);

			if (transformStr !== this.lastTransform) {
				this.lastTransform = transformStr;
				this.updateMinimap();
			}

			this.rafId = requestAnimationFrame(check);
		};

		this.rafId = requestAnimationFrame(check);
	}

	/**
	 * 停止 transform 变化检查
	 */
	private stopTransformCheck(): void {
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	private createMinimapDOM(): void {
		if (this.minimapContainer) return;

		const options = this.getOptions<MinimapPluginOptions>();

		// 确保容器有正确的定位
		const containerStyle = window.getComputedStyle(this.imageMark.container);
		if (containerStyle.position === 'static') {
			this.imageMark.container.style.position = 'relative';
		}

		// 创建容器
		this.minimapContainer = document.createElement('div');
		this.minimapContainer.className = 'image-mark-minimap';
		this.minimapContainer.style.position = 'absolute';
		this.minimapContainer.style.zIndex = '1000';
		this.minimapContainer.style.padding = `${options.padding}px`;
		this.minimapContainer.style.pointerEvents = 'auto';
		this.minimapContainer.style.opacity = `${options.opacity}`;
		this.minimapContainer.style.userSelect = 'none';

		// 设置位置
		const position = options.position || 'bottom-right';
		if (position.includes('top')) {
			this.minimapContainer.style.top = '0';
		} else {
			this.minimapContainer.style.bottom = '0';
		}
		if (position.includes('left')) {
			this.minimapContainer.style.left = '0';
		} else {
			this.minimapContainer.style.right = '0';
		}

		// 创建 canvas
		this.minimapCanvas = document.createElement('canvas');
		this.minimapCanvas.style.display = 'block';
		this.minimapCanvas.style.border = `${options.border?.width}px solid ${options.border?.color}`;
		this.minimapCanvas.style.background = options.background || '#fff';
		this.minimapCanvas.style.cursor = 'pointer';
		this.minimapCanvas.style.borderRadius = '4px';
		this.minimapCanvas.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
		this.minimapCanvas.style.userSelect = 'none';

		this.minimapCtx = this.minimapCanvas.getContext('2d')!;

		this.minimapContainer.appendChild(this.minimapCanvas);
		this.imageMark.container.appendChild(this.minimapContainer);

		// 绑定拖拽事件
		this.minimapCanvas.addEventListener('mousedown', this.onCanvasMouseDown);
		this.minimapCanvas.addEventListener('contextmenu', this.onCanvasContextMenu);
		document.addEventListener('mousemove', this.onDocumentMouseMove);
		document.addEventListener('mouseup', this.onDocumentMouseUp);
	}

	private calculateMinimapSize(): void {
		const options = this.getOptions<MinimapPluginOptions>();
		const maxSize = options.size || 200;
		const imgWidth = this.imageMark.imageDom.naturalWidth;
		const imgHeight = this.imageMark.imageDom.naturalHeight;

		if (imgWidth > imgHeight) {
			this.minimapWidth = maxSize;
			this.minimapHeight = (imgHeight / imgWidth) * maxSize;
		} else {
			this.minimapHeight = maxSize;
			this.minimapWidth = (imgWidth / imgHeight) * maxSize;
		}

		this.scale = this.minimapWidth / imgWidth;

		if (this.minimapCanvas) {
			this.minimapCanvas.width = this.minimapWidth;
			this.minimapCanvas.height = this.minimapHeight;
		}
	}

	private updateMinimap(): void {
		if (!this.minimapCtx || !this.minimapCanvas) return;

		const ctx = this.minimapCtx;

		// 清空画布
		ctx.clearRect(0, 0, this.minimapWidth, this.minimapHeight);

		// 绘制图片
		this.drawImage();

		// 绘制所有 shapes
		this.drawShapes();

		// 绘制当前视口
		this.drawViewport();
	}

	private drawImage(): void {
		if (!this.minimapCtx) return;

		try {
			this.minimapCtx.drawImage(
				this.imageMark.imageDom,
				0,
				0,
				this.minimapWidth,
				this.minimapHeight
			);
		} catch (e) {
			console.warn('Failed to draw image in minimap:', e);
		}
	}

	private drawShapes(): void {
		if (!this.minimapCtx) return;

		const options = this.getOptions<MinimapPluginOptions>();
		const shapePlugin = this.imageMark.getShapePlugin();
		if (!shapePlugin) return;

		const drawContext: MinimapDrawContext = {
			ctx: this.minimapCtx,
			scale: this.scale,
			fill: options.shapeStyle?.fill,
			stroke: options.shapeStyle?.stroke,
			strokeWidth: options.shapeStyle?.strokeWidth
		};

		shapePlugin.data.forEach(shapeData => {
			const shapeInstance = shapePlugin.getInstanceByData(shapeData);
			if (shapeInstance && shapeInstance.drawMinimap) {
				try {
					shapeInstance.drawMinimap(drawContext);
				} catch (e) {
					console.warn(`Failed to draw shape ${shapeData.shapeName} in minimap:`, e);
				}
			}
		});
	}

	private drawViewport(): void {
		if (!this.minimapCtx) return;

		const options = this.getOptions<MinimapPluginOptions>();
		const ctx = this.minimapCtx;

		// 获取当前视口信息
		const viewportRect = this.getViewportRect();
		if (!viewportRect) return;

		// 绘制视口矩形
		ctx.strokeStyle = options.viewportStyle?.stroke || '#FF7D00';
		ctx.lineWidth = options.viewportStyle?.strokeWidth || 2;
		ctx.fillStyle = options.viewportStyle?.fill || 'rgba(255, 125, 0, 0.1)';

		ctx.fillRect(viewportRect.x, viewportRect.y, viewportRect.width, viewportRect.height);
		ctx.strokeRect(viewportRect.x, viewportRect.y, viewportRect.width, viewportRect.height);
	}

	/**
	 * 获取当前视口在 minimap 中的位置和大小
	 */
	private getViewportRect(): { x: number; y: number; width: number; height: number } | null {
		const transform = this.imageMark.stageGroup.transform();
		const currentScale = this.imageMark.getCurrentScale();
		const containerRect = this.imageMark.container.getBoundingClientRect();
		const imageRect = this.imageMark.image.node.getBoundingClientRect();

		// 计算视口在图片坐标系中的位置和大小
		const viewportX = (containerRect.left - imageRect.left) / currentScale;
		const viewportY = (containerRect.top - imageRect.top) / currentScale;
		const viewportWidth = containerRect.width / currentScale;
		const viewportHeight = containerRect.height / currentScale;

		// 转换到 minimap 坐标系
		return {
			x: viewportX * this.scale,
			y: viewportY * this.scale,
			width: viewportWidth * this.scale,
			height: viewportHeight * this.scale
		};
	}

	/**
	 * 将 minimap 上的点击位置转换为图片坐标系中的位置
	 */
	private minimapPointToImagePoint(minimapX: number, minimapY: number): { x: number; y: number } {
		return {
			x: minimapX / this.scale,
			y: minimapY / this.scale
		};
	}

	/**
	 * 检查是否需要限制视口在图片范围内
	 */
	private shouldConstrainToImage(): boolean {
		const options = this.getOptions<MinimapPluginOptions>();
		// 如果明确设置了 constrainToImage，使用该值
		if (options.constrainToImage !== undefined) {
			return options.constrainToImage;
		}
		// 否则跟随 imageFullOfContainer 的设置
		return this.imageMark.options.setting?.imageFullOfContainer ?? false;
	}

	/**
	 * 移动主画布使视口中心对齐到指定的图片坐标
	 */
	private moveViewportTo(imageX: number, imageY: number): void {
		const currentScale = this.imageMark.getCurrentScale();
		const containerRect = this.imageMark.container.getBoundingClientRect();
		const imgWidth = this.imageMark.imageDom.naturalWidth;
		const imgHeight = this.imageMark.imageDom.naturalHeight;

		// 如果需要限制视口在图片范围内
		if (this.shouldConstrainToImage()) {
			const viewportWidth = containerRect.width / currentScale;
			const viewportHeight = containerRect.height / currentScale;

			// 计算视口中心点的有效范围
			// 视口中心点最小值：使视口右/下边缘不超过图片左/上边缘
			// 视口中心点最大值：使视口左/上边缘不超过图片右/下边缘
			const minX = viewportWidth / 2;
			const minY = viewportHeight / 2;
			const maxX = imgWidth - viewportWidth / 2;
			const maxY = imgHeight - viewportHeight / 2;

			// 如果视口比图片大，则居中显示
			if (viewportWidth >= imgWidth) {
				imageX = imgWidth / 2;
			} else {
				imageX = Math.max(minX, Math.min(maxX, imageX));
			}

			if (viewportHeight >= imgHeight) {
				imageY = imgHeight / 2;
			} else {
				imageY = Math.max(minY, Math.min(maxY, imageY));
			}
		}

		// 目标：让图片坐标 (imageX, imageY) 显示在容器中心
		// 计算目标 translate 值
		const targetTranslateX = containerRect.width / 2 - imageX * currentScale;
		const targetTranslateY = containerRect.height / 2 - imageY * currentScale;

		// 获取当前 transform
		const { translateX = 0, translateY = 0 } = this.imageMark.stageGroup.transform();

		// 使用 translate 方法设置绝对位置
		// translate 是相对的，所以先减去当前值再加上目标值
		this.imageMark.stageGroup.translate(
			-translateX + targetTranslateX,
			-translateY + targetTranslateY
		);
	}

	// 事件处理
	private onCanvasMouseDown = (event: MouseEvent) => {
		if (!this.minimapCanvas) return;
		// 只响应左键点击
		if (event.button !== 0) return;

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		this.isDragging = true;

		// 临时禁用主画布的状态（如果正在移动）
		if (this.imageMark.status.moving) {
			this.wasMainCanvasMoving = true;
			this.imageMark.status.moving = false;
		}

		// 立即移动视口到点击位置
		const rect = this.minimapCanvas.getBoundingClientRect();
		const clickX = event.clientX - rect.left;
		const clickY = event.clientY - rect.top;
		const imagePoint = this.minimapPointToImagePoint(clickX, clickY);
		this.moveViewportTo(imagePoint.x, imagePoint.y);
	};

	private onCanvasContextMenu = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
	};

	private onDocumentMouseMove = (event: MouseEvent) => {
		if (!this.isDragging || !this.minimapCanvas) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();

		const rect = this.minimapCanvas.getBoundingClientRect();
		let currentX = event.clientX - rect.left;
		let currentY = event.clientY - rect.top;

		// 限制在 minimap 范围内
		currentX = Math.max(0, Math.min(currentX, this.minimapWidth));
		currentY = Math.max(0, Math.min(currentY, this.minimapHeight));

		// 直接移动视口到当前鼠标位置
		const imagePoint = this.minimapPointToImagePoint(currentX, currentY);
		this.moveViewportTo(imagePoint.x, imagePoint.y);
	};

	private onDocumentMouseUp = (event: MouseEvent) => {
		if (this.isDragging) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			// 恢复主画布状态
			if (this.wasMainCanvasMoving) {
				this.wasMainCanvasMoving = false;
			}
		}
		this.isDragging = false;
	};

	onRerender = () => {
		this.calculateMinimapSize();
		this.updateMinimap();
	};

	onScale = () => {
		this.updateMinimap();
	};

	onShapeUpdate = () => {
		this.updateMinimap();
	};

	onShapeAdd = () => {
		this.updateMinimap();
	};

	onShapeDelete = () => {
		this.updateMinimap();
	};

	onShapePluginDataChange = () => {
		this.updateMinimap();
	};

	destroy(): void {
		this.stopTransformCheck();
		this.unbindEvent();
		this.minimapContainer?.remove();
		this.minimapContainer = undefined;
		this.minimapCanvas = undefined;
		this.minimapCtx = undefined;
		super.destroy();
	}
}
