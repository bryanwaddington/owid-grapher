export declare class PointVector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    subtract(v: PointVector): PointVector;
    add(v: PointVector): PointVector;
    times(n: number): PointVector;
    get magnitude(): number;
    normalize(): PointVector;
    normals(): [PointVector, PointVector];
    toString(): string;
    static up: PointVector;
    static zero: PointVector;
    static distanceSq(a: PointVector, b: PointVector): number;
    static distance(a: PointVector, b: PointVector): number;
    static angle(a: PointVector, b: PointVector): number;
    private static dot;
    static distanceFromPointToLineSq(p: PointVector, v: PointVector, w: PointVector): number;
}
//# sourceMappingURL=PointVector.d.ts.map