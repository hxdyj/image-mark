export function setTitle(title: string) {
	const headEle = document.querySelector('head')
	if (headEle) {
		const titleEle = headEle.querySelector('title')
		if (titleEle) {
			titleEle.innerText = title
		}
	}
}
