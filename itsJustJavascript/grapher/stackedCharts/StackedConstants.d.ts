import { ChartSeries } from "../chart/ChartInterface";
export declare type StackedPointPositionType = string | number;
export interface StackedPoint<PositionType extends StackedPointPositionType> {
    position: PositionType;
    value: number;
    valueOffset: number;
    time: number;
    fake?: boolean;
}
export interface StackedSeries<PositionType extends StackedPointPositionType> extends ChartSeries {
    points: StackedPoint<PositionType>[];
    isProjection?: boolean;
}
//# sourceMappingURL=StackedConstants.d.ts.map