import { BinningStrategy } from "./BinningStrategy";
/** Human-readable labels for the binning strategies */
export declare const binningStrategyLabels: Record<BinningStrategy, string>;
interface GetBinMaximumsWithStrategyArgs {
    binningStrategy: BinningStrategy;
    sortedValues: number[];
    binCount: number;
    /** `minBinValue` is only used in the `equalInterval` binning strategy. */
    minBinValue?: number;
}
export declare function getBinMaximums(args: GetBinMaximumsWithStrategyArgs): number[];
export {};
//# sourceMappingURL=BinningStrategies.d.ts.map