import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { ChartInterface } from "../chart/ChartInterface";
import { DiscreteBarChartManager, DiscreteBarSeries } from "./DiscreteBarChartConstants";
import { OwidTable } from "../../coreTable/OwidTable";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
export declare class DiscreteBarChart extends React.Component<{
    bounds?: Bounds;
    manager: DiscreteBarChartManager;
}> implements ChartInterface {
    base: React.RefObject<SVGGElement>;
    transformTable(table: OwidTable): OwidTable;
    get inputTable(): OwidTable;
    get transformedTable(): OwidTable;
    private get manager();
    private get targetTime();
    private get isLogScale();
    private get bounds();
    private get baseFontSize();
    private get legendLabelStyle();
    private get valueLabelStyle();
    private get legendWidth();
    private get hasPositive();
    private get hasNegative();
    private get rightValueLabelWidth();
    private get leftValueLabelWidth();
    private get x0();
    private get xDomainDefault();
    private get xRange();
    private get yAxis();
    private get axis();
    private get innerBounds();
    private get selectionArray();
    private get barCount();
    private get barHeight();
    private get barSpacing();
    private get barPlacements();
    private get barWidths();
    private d3Bars;
    private animateBarWidth;
    componentDidMount(): void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    get failMessage(): string;
    formatValue(series: DiscreteBarSeries): string;
    protected get yColumnSlugs(): string[];
    private get seriesStrategy();
    protected get yColumns(): CoreColumn[];
    private get columnsAsSeries();
    private get entitiesAsSeries();
    private get sortedRawSeries();
    private get colorScheme();
    private get valuesToColorsMap();
    get series(): DiscreteBarSeries[];
}
//# sourceMappingURL=DiscreteBarChart.d.ts.map