import { ChartManager } from "../chart/ChartManager";
import { Time } from "../../coreTable/CoreTableConstants";
import { ChartSeries } from "../chart/ChartInterface";
export interface DiscreteBarSeries extends ChartSeries {
    value: number;
    time: Time;
}
export interface DiscreteBarChartManager extends ChartManager {
    showYearLabels?: boolean;
    endTime?: Time;
    isLineChart?: boolean;
}
export declare const DEFAULT_BAR_COLOR = "#2E5778";
//# sourceMappingURL=DiscreteBarChartConstants.d.ts.map