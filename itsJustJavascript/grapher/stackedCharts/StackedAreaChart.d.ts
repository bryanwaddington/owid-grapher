/// <reference types="react" />
import { SeriesName } from "../core/GrapherConstants";
import { VerticalAxis } from "../axis/Axis";
import { LineLabelSeries, LineLegend, LineLegendManager } from "../lineLegend/LineLegend";
import { AbstactStackedChart, AbstactStackedChartProps } from "../stackedCharts/AbstractStackedChart";
import { StackedSeries } from "./StackedConstants";
import { Time } from "../../clientUtils/owidTypes";
export declare class StackedAreaChart extends AbstactStackedChart<Time> implements LineLegendManager {
    constructor(props: AbstactStackedChartProps);
    get verticalAxis(): VerticalAxis;
    get midpoints(): number[];
    get labelSeries(): LineLabelSeries[];
    get maxLegendWidth(): number;
    get legendDimensions(): LineLegend | undefined;
    hoveredPointIndex?: number;
    onHover(hoverIndex: number | undefined): void;
    hoverSeriesName?: SeriesName;
    onLegendClick(): void;
    protected get paddingForLegend(): number;
    onLegendMouseOver(seriesName: SeriesName): void;
    onLegendMouseLeave(): void;
    get focusedSeriesNames(): string[];
    get isFocusMode(): boolean;
    seriesIsBlur(series: StackedSeries<Time>): boolean;
    private get tooltip();
    render(): JSX.Element;
    /** Whether we want to display series with only zeroes (inherited). False for this class, true for others */
    get showAllZeroSeries(): boolean;
    get legendX(): number;
    get series(): readonly StackedSeries<number>[];
}
//# sourceMappingURL=StackedAreaChart.d.ts.map