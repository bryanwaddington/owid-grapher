import * as React from "react";
import { ScaleLinear } from "d3-scale";
declare enum BarState {
    highlighted = "highlighted",
    current = "current",
    normal = "normal",
    faint = "faint"
}
export interface SparkBarsProps<T> {
    data: T[];
    x: (d: T) => number;
    y: (d: T) => number | undefined;
    xDomain: [number, number];
    currentX?: number;
    highlightedX?: number;
    renderValue?: (d: T | undefined) => JSX.Element | undefined;
    onHover?: (d: T | undefined, index: number | undefined) => void;
    className?: string;
    color?: string;
}
export interface SparkBarsDatum {
    time: number;
    value: number;
}
export declare class SparkBars<T> extends React.Component<SparkBarsProps<T>> {
    static defaultProps: {
        onHover: () => undefined;
        className: string;
    };
    get maxY(): number | undefined;
    get barHeightScale(): ScaleLinear<number, number>;
    barHeight(d: T | undefined): string;
    barState(d: number): BarState;
    get bars(): (T | undefined)[];
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=SparkBars.d.ts.map