export declare class ScreenMatrix2D {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    createNewMatrix(...params: ConstructorParameters<typeof ScreenMatrix2D>): any;
    multiply(m: ScreenMatrix2D): ScreenMatrix2D;
    translate(x: number, y: number): ScreenMatrix2D;
    rotate(angle: number): ScreenMatrix2D;
    angle2rad(angle: number): number;
    calculateRotateInfo(angle: number): {
        cos: number;
        sin: number;
    };
    scale(sx: number, sy?: number): ScreenMatrix2D;
    rotateAroundPoint(angle: number, x: number, y: number): ScreenMatrix2D;
    inverse(): ScreenMatrix2D;
    transformPoint(x: number, y: number): {
        x: number;
        y: number;
    };
    clone(): ScreenMatrix2D;
    identity(): ScreenMatrix2D;
    getScale(): {
        sx: number;
        sy: number;
    };
    getRotation(): number;
    toArray(): number[];
    static fromArray(arr: number[]): ScreenMatrix2D;
    log(): this;
}
