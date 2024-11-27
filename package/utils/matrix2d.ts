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
			this.a * m.a + this.b * m.c,        // a
			this.a * m.b + this.b * m.d,        // b
			this.c * m.a + this.d * m.c,        // c
			this.c * m.b + this.d * m.d,        // d
			this.a * m.e + this.b * m.f + this.e,  // e
			this.c * m.e + this.d * m.f + this.f   // f
		);
	}

	// 平移
	translate(x: number, y: number): Matrix2D {
		return this.multiply(this.createNewMatrix(1, 0, 0, 1, x, y));
	}

	// 旋转（角度）
	rotate(angle: number): Matrix2D {
		const { cos, sin } = this.calculateRotateInfo(angle);
		return this.multiply(this.createNewMatrix(cos, sin, -sin, cos, 0, 0));
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

	// 获取逆矩阵
	inverse(): Matrix2D {
		const det = this.a * this.d - this.b * this.c;
		if (det === 0) {
			throw new Error('Matrix is not invertible');
		}

		const invDet = 1 / det;
		const a = this.d * invDet;
		const b = -this.b * invDet;
		const c = -this.c * invDet;
		const d = this.a * invDet;
		const e = -(a * this.e + c * this.f);
		const f = -(b * this.e + d * this.f);

		return this.createNewMatrix(a, b, c, d, e, f);
	}

	// 转换点坐标
	transformPoint(x: number, y: number): { x: number, y: number } {
		return {
			x: x * this.a + y * this.c + this.e,
			y: x * this.b + y * this.d + this.f
		};
	}

	// 克隆矩阵
	clone(): Matrix2D {
		return this.createNewMatrix(this.a, this.b, this.c, this.d, this.e, this.f);
	}

	// 重置为单位矩阵
	identity(): Matrix2D {
		this.a = 1; this.b = 0;
		this.c = 0; this.d = 1;
		this.e = 0; this.f = 0;
		return this;
	}

	// 获取当前的缩放值
	getScale(): { sx: number, sy: number } {
		return {
			sx: Math.sqrt(this.a * this.a + this.b * this.b),
			sy: Math.sqrt(this.c * this.c + this.d * this.d)
		};
	}

	// 获取当前的旋转角度（弧度）
	getRotation(): number {
		return Math.atan2(this.b, this.a);
	}

	// 转换为数组
	toArray(): number[] {
		return [this.a, this.b, this.c, this.d, this.e, this.f];
	}

	//从数组创建矩阵
	static fromArray(arr: number[]) {
		if (arr.length !== 6) {
			throw new Error('Array must have 6 elements');
		}
		return new this(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
	}

	log() {
		console.log(`matrix: ${this.a} ${this.b} ${this.c} ${this.d} ${this.e} ${this.f}`);
		return this;
	}
}

