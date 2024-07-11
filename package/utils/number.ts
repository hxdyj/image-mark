export function areFloatsEqual(a: number, b: number, precision: number = 3): boolean {
	const epsilon = Math.pow(10, -precision);
	return Math.abs(a - b) < epsilon;
}
export function areNumberEqual(a: number, b: number, precision: number = 5): boolean {
	return Math.abs(Math.abs(a) - Math.abs(b)) <= precision
}
