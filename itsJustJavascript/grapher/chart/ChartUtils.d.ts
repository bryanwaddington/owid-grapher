import { Box } from "../../clientUtils/owidTypes";
import { SeriesStrategy } from "../core/GrapherConstants";
import { LineChartSeries } from "../lineCharts/LineChartConstants";
import { SelectionArray } from "../selection/SelectionArray";
import { ChartManager } from "./ChartManager";
export declare const autoDetectYColumnSlugs: (manager: ChartManager) => string[];
export declare const getDefaultFailMessage: (manager: ChartManager) => string;
export declare const getSeriesKey: (series: LineChartSeries, suffix?: string | undefined) => string;
export declare const autoDetectSeriesStrategy: (manager: ChartManager, hasNormalAndProjectedSeries?: boolean | undefined) => SeriesStrategy;
export declare const makeClipPath: (renderUid: number, box: Box) => {
    id: string;
    element: JSX.Element;
};
export declare const makeSelectionArray: (manager: ChartManager) => SelectionArray;
//# sourceMappingURL=ChartUtils.d.ts.map