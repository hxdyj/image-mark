export declare class Matrix2D1 {
    a: import('mathjs').BigNumber;
    b: import('mathjs').BigNumber;
    c: import('mathjs').BigNumber;
    d: import('mathjs').BigNumber;
    e: import('mathjs').BigNumber;
    f: import('mathjs').BigNumber;
    constructor(a?: import('mathjs').BigNumber, b?: import('mathjs').BigNumber, c?: import('mathjs').BigNumber, d?: import('mathjs').BigNumber, e?: import('mathjs').BigNumber, f?: import('mathjs').BigNumber);
    createNewMatrix(...params: ConstructorParameters<typeof Matrix2D1>): any;
    multiply(m: Matrix2D1): Matrix2D1;
    translate(x: number, y: number): Matrix2D1;
    rotate(angle: number): Matrix2D1;
    angle2rad(angle: number): import('mathjs').MathType;
    calculateRotateInfo(angle: number): {
        cos: number;
        sin: number;
    };
    scale(sx: number, sy?: number): Matrix2D1;
    rotateAroundPoint(angle: number, x: number, y: number): Matrix2D1;
    log(): this;
}
