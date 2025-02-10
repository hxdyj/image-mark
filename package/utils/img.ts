export function loadImage(src: string, crossOrigin?: boolean): Promise<HTMLImageElement> {
	let img = new Image()
	if (crossOrigin) {
		img.crossOrigin = 'anonymous'
	}
	img.src = src
	return new Promise((resolve, reject) => {
		if (img.complete) {
			resolve(img)
		} else {
			img.onload = function () {
				resolve(img)
			}
			img.onerror = function () {
				reject('图片加载失败:' + img.src)
			}
		}
	})
}
