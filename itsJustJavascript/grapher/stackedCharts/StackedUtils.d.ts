import { StackedPointPositionType, StackedSeries } from "./StackedConstants";
export declare const stackSeries: <PositionType extends StackedPointPositionType>(seriesArr: readonly StackedSeries<PositionType>[]) => readonly StackedSeries<PositionType>[];
export declare const withMissingValuesAsZeroes: <PositionType extends StackedPointPositionType>(seriesArr: readonly StackedSeries<PositionType>[]) => StackedSeries<PositionType>[];
//# sourceMappingURL=StackedUtils.d.ts.map