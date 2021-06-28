import { Color } from "../../coreTable/CoreTableConstants";
import { OwidTable } from "../../coreTable/OwidTable";
import { SeriesName } from "../core/GrapherConstants";
import { ColorScale } from "../color/ColorScale";
export interface ChartSeries {
    seriesName: SeriesName;
    color: Color;
}
export declare type ChartTableTransformer = (inputTable: OwidTable) => OwidTable;
export interface ChartInterface {
    failMessage: string;
    inputTable: OwidTable;
    transformedTable: OwidTable;
    colorScale?: ColorScale;
    series: readonly ChartSeries[];
    transformTable: ChartTableTransformer;
}
//# sourceMappingURL=ChartInterface.d.ts.map