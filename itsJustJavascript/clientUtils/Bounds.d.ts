import { PointVector } from "./PointVector";
import { Box } from "./owidTypes";
export declare class Bounds {
    static ctx: CanvasRenderingContext2D;
    static fromProps(props: Box): Bounds;
    static fromBBox(bbox: Box): Bounds;
    static fromRect(rect: ClientRect): Bounds;
    static fromElement(el: HTMLElement): Bounds;
    static fromCorners(p1: PointVector, p2: PointVector): Bounds;
    static merge(boundsList: Bounds[]): Bounds;
    static getRightShiftForMiddleAlignedTextIfNeeded(label: string, fontSize: number, xPosition: number): number;
    static empty(): Bounds;
    static forText(str?: string, { x, y, fontSize, fontWeight, }?: {
        x?: number;
        y?: number;
        fontSize?: number;
        fontWeight?: number;
        fontFamily?: string;
    }): Bounds;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    constructor(x: number, y: number, width: number, height: number);
    get left(): number;
    get top(): number;
    get right(): number;
    get bottom(): number;
    get centerX(): number;
    get centerY(): number;
    get centerPos(): PointVector;
    get area(): number;
    get topLeft(): PointVector;
    get topRight(): PointVector;
    get bottomLeft(): PointVector;
    get bottomRight(): PointVector;
    padLeft(amount: number): Bounds;
    padRight(amount: number): Bounds;
    padBottom(amount: number): Bounds;
    padTop(amount: number): Bounds;
    padWidth(amount: number): Bounds;
    padHeight(amount: number): Bounds;
    fromLeft(amount: number): Bounds;
    fromBottom(amount: number): Bounds;
    pad(amount: number): Bounds;
    extend(props: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }): Bounds;
    scale(scale: number): Bounds;
    intersects(otherBounds: Bounds): boolean;
    lines(): PointVector[][];
    boundedPoint(p: PointVector): PointVector;
    containsPoint(x: number, y: number): boolean;
    contains(p: PointVector): boolean;
    encloses(bounds: Bounds): boolean;
    toCSS(): {
        left: string;
        top: string;
        width: string;
        height: string;
    };
    toProps(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    toArray(): [[number, number], [number, number]];
    xRange(): [number, number];
    split(pieces: number, padding?: SplitBoundsPadding): Bounds[];
    yRange(): [number, number];
    equals(bounds: Bounds): boolean;
    private distanceToPointSq;
    distanceToPoint(p: PointVector): number;
}
interface SplitBoundsPadding {
    columnPadding?: number;
    rowPadding?: number;
    outerPadding?: number;
}
export declare const DEFAULT_BOUNDS: Bounds;
export {};
//# sourceMappingURL=Bounds.d.ts.map