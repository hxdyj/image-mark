import { Matrix2D } from "./matrix2d";

export class ScreenMatrix2D extends Matrix2D {
	constructor(
		public a = 1, public b = 0,
		public c = 0, public d = 1,
		public e = 0, public f = 0
	) {
		super(a, b, c, d, e, f);
	}

	createNewMatrix(...params: ConstructorParameters<typeof ScreenMatrix2D>) {
		const constructor = Object.getPrototypeOf(this).constructor
		//@ts-ignore
		params[5] *= -1
		return new constructor(...params)
	}

	// 平移
	translate(x: number, y: number): ScreenMatrix2D {
		return this.multiply(this.createNewMatrix(1, 0, 0, 1, x, y));
	}

	// 旋转（角度）
	rotate(angle: number): ScreenMatrix2D {
		const { cos, sin } = this.calculateRotateInfo(angle);
		return this.multiply(this.createNewMatrix(cos, sin, -sin, cos, 0, 0));
	}

}

