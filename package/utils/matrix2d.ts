export class Matrix2D {
	/*
		[ a , c  , e  ]
		[	b , d  , f  ]
	*/
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
			this.a * m.a + this.c * m.b,
			this.b * m.a + this.d * m.b,
			this.a * m.c + this.c * m.d,
			this.b * m.c + this.d * m.d,
			this.a * m.e + this.c * m.f + this.e,
			this.b * m.e + this.d * m.f + this.f
		);
	}

	// 平移
	translate(x: number, y: number): Matrix2D {
		return this.multiply(this.createNewMatrix(1, 0, 0, 1, x, y));
	}

	// 旋转（角度）
	rotate(angle: number): Matrix2D {
		const { cos, sin } = this.calculateRotateInfo(angle);
		// console.log(`
		// 	rotate angle: ${angle}
		// 	cos: ${cos}
		// 	sin: ${sin}
		// 	`)
		return this.multiply(this.createNewMatrix(cos, sin, -sin, cos, 0, 0))
	}

	rotateByPoint(angle: number, point: [number, number]): Matrix2D {
		return this.translate(point[0], point[1]).rotate(angle).translate(-point[0], -point[1]);
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

	log() {
		console.log(`
========================================
${this.a} ${this.c} ${this.e}
${this.b} ${this.d} ${this.f}
0 0 1
========================================
matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})
========================================
`);
		return this;
	}
}

