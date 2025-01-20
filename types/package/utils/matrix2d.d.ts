export declare class Matrix2D {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    createNewMatrix(...params: ConstructorParameters<typeof Matrix2D>): any;
    multiply(m: Matrix2D): Matrix2D;
    translate(x: number, y: number): Matrix2D;
    rotate(angle: number): Matrix2D;
    rotateByPoint(angle: number, point: [number, number]): Matrix2D;
    angle2rad(angle: number): number;
    calculateRotateInfo(angle: number): {
        cos: number;
        sin: number;
    };
    scale(sx: number, sy?: number): Matrix2D;
    log(): this;
}
