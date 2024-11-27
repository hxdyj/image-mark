import { add, bignumber, cos as mathCos, sin as mathSin, divide, multiply, pi } from "mathjs";

export class Matrix2D1 {
	constructor(
		public a = bignumber(1), public b = bignumber(0),
		public c = bignumber(0), public d = bignumber(1),
		public e = bignumber(0), public f = bignumber(0)
	) { }

	createNewMatrix(...params: ConstructorParameters<typeof Matrix2D1>) {
		const constructor = Object.getPrototypeOf(this).constructor
		//@ts-ignore
		params[5] = multiply(bignumber(-1), params[5])
		return new constructor(...params)
	}

	// 矩阵乘法
	multiply(m: Matrix2D1): Matrix2D1 {
		return this.createNewMatrix(
			add(multiply(this.a, m.a), multiply(this.b, m.c)),        // a
			add(multiply(this.a, m.b), multiply(this.b, m.d)),        // b
			add(multiply(this.c, m.a), multiply(this.d, m.c)),        // c
			add(multiply(this.c, m.b), multiply(this.d, m.d)),        // d
			add(multiply(this.a, m.e), multiply(this.b, m.f), this.e),  // e
			add(multiply(this.c, m.e), multiply(this.d, m.f), this.f)   // f
		);
	}

	// 平移
	translate(x: number, y: number): Matrix2D1 {
		return this.multiply(this.createNewMatrix(bignumber(1), bignumber(0), bignumber(0), bignumber(1), bignumber(x), bignumber(y)));
	}

	// 旋转（角度）
	rotate(angle: number): Matrix2D1 {
		const { cos, sin } = this.calculateRotateInfo(angle);
		const inverseSin = multiply(bignumber(-1), sin);
		// 直接处理旋转后的b和c值，确保符号与SVG一致
		return this.multiply(this.createNewMatrix(cos, sin, inverseSin, cos, bignumber(0), bignumber(0)));
	}


	angle2rad(angle: number) {
		return divide(multiply(bignumber(angle), bignumber(pi)), bignumber(180));
	}

	calculateRotateInfo(angle: number) {
		const rad = this.angle2rad(angle);
		const cos = mathCos(rad);
		const sin = mathSin(rad);
		return { cos, sin };
	}

	// 缩放
	scale(sx: number, sy = sx): Matrix2D1 {
		return this.multiply(this.createNewMatrix(sx, 0, 0, sy, 0, 0));
	}

	// 围绕指定点旋转
	rotateAroundPoint(angle: number, x: number, y: number): Matrix2D1 {
		return this
			.translate(x, y)
			.rotate(angle)
			.translate(-x, -y);
	}

	log() {
		console.log(`matrix: ${this.a} ${this.b} ${this.c} ${this.d} ${this.e} ${this.f}`);
		return this;
	}
}
