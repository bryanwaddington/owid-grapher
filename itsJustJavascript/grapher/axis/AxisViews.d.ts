import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { VerticalAxis, HorizontalAxis, DualAxis } from "./Axis";
import { ScaleType } from "../core/GrapherConstants";
export declare class VerticalAxisGridLines extends React.Component<{
    verticalAxis: VerticalAxis;
    bounds: Bounds;
}> {
    render(): JSX.Element;
}
export declare class HorizontalAxisGridLines extends React.Component<{
    horizontalAxis: HorizontalAxis;
    bounds?: Bounds;
}> {
    get bounds(): Bounds;
    render(): JSX.Element;
}
interface DualAxisViewProps {
    dualAxis: DualAxis;
    highlightValue?: {
        x: number;
        y: number;
    };
    showTickMarks?: boolean;
}
export declare class DualAxisComponent extends React.Component<DualAxisViewProps> {
    render(): JSX.Element;
}
export declare class VerticalAxisComponent extends React.Component<{
    bounds: Bounds;
    verticalAxis: VerticalAxis;
}> {
    render(): JSX.Element;
}
export declare class HorizontalAxisComponent extends React.Component<{
    bounds: Bounds;
    axis: HorizontalAxis;
    axisPosition: number;
    showTickMarks?: boolean;
}> {
    get scaleType(): ScaleType;
    set scaleType(scaleType: ScaleType);
    get bounds(): Bounds;
    render(): JSX.Element;
}
export declare class AxisTickMarks extends React.Component<{
    tickMarkTopPosition: number;
    tickMarkXPositions: number[];
    color: string;
}> {
    render(): JSX.Element[];
}
export {};
//# sourceMappingURL=AxisViews.d.ts.map