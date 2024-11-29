export class Matrix2D {
	constructor(
		public a = 1, public b = 0,
		public c = 0, public d = 1,
		public e = 0, public f = 0
	) { }

	createNewMatrix(...params: ConstructorParameters<typeof Matrix2D>) {
		const constructor = Object.getPrototypeOf(this).constructor
		return new constructor(...params)
	}

	// 矩阵乘法
	multiply(m: Matrix2D): Matrix2D {
		return this.createNewMatrix(
			m.a * this.a + m.b * this.c, //a
			m.a * this.b + m.b * this.d, //b
			m.c * this.a + m.d * this.c, //c
			m.c * this.b + m.d * this.d, //d
			m.a * this.e + m.b * this.f + m.e, //e
			m.c * this.e + m.d * this.f + m.f, //f
		);
	}

	// 平移
	translate(x: number, y: number): Matrix2D {
		return this.multiply(this.createNewMatrix(1, 0, 0, 1, x, y));
	}

	// 旋转（角度）
	rotate(angle: number): Matrix2D {
		const { cos, sin } = this.calculateRotateInfo(angle);
		return this.multiply(this.createNewMatrix(cos, -sin, sin, cos, 0, 0));
	}

	angle2rad(angle: number) {
		return angle * Math.PI / 180;
	}

	calculateRotateInfo(angle: number) {
		const rad = this.angle2rad(angle);
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);
		return { cos, sin };
	}

	// 缩放
	scale(sx: number, sy = sx): Matrix2D {
		return this.multiply(this.createNewMatrix(sx, 0, 0, sy, 0, 0));
	}

	// 围绕指定点旋转
	rotateAroundPoint(angle: number, x: number, y: number): Matrix2D {
		return this
			.translate(x, y)
			.rotate(angle)
			.translate(-x, -y);
	}


	log() {
		console.log(`matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`);
		return this;
	}
}

