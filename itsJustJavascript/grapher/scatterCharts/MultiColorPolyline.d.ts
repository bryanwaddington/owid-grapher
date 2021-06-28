import * as React from "react";
interface MultiColorPolylinePoint {
    x: number;
    y: number;
    color: string;
}
interface Point {
    x: number;
    y: number;
}
interface Segment {
    points: Point[];
    color: string;
}
export declare function getSegmentsFromPoints(points: MultiColorPolylinePoint[]): Segment[];
declare type MultiColorPolylineProps = Omit<React.SVGProps<SVGPolylineElement>, "fill" | "stroke" | "points" | "strokeLinecap"> & {
    points: MultiColorPolylinePoint[];
};
export declare class MultiColorPolyline extends React.Component<MultiColorPolylineProps> {
    get segments(): Segment[];
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=MultiColorPolyline.d.ts.map