import { ScatterLabel, ScatterRenderSeries } from "./ScatterPlotChartConstants";
export declare const labelPriority: (label: ScatterLabel) => number;
export declare const makeStartLabel: (series: ScatterRenderSeries, isSubtleForeground: boolean, hideConnectedScatterLines: boolean) => ScatterLabel | undefined;
export declare const makeMidLabels: (series: ScatterRenderSeries, isSubtleForeground: boolean, hideConnectedScatterLines: boolean) => ScatterLabel[];
export declare const makeEndLabel: (series: ScatterRenderSeries, isSubtleForeground: boolean, hideConnectedScatterLines: boolean) => ScatterLabel;
//# sourceMappingURL=ScatterUtils.d.ts.map