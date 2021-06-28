import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { SeriesName } from "../core/GrapherConstants";
import { ChartInterface } from "../chart/ChartInterface";
import { OwidTable } from "../../coreTable/OwidTable";
import { ChartManager } from "../chart/ChartManager";
import { Time } from "../../clientUtils/owidTypes";
import { StackedSeries } from "./StackedConstants";
import { EntityName } from "../../coreTable/OwidTableConstants";
import { LegendAlign, HorizontalColorLegendManager } from "../horizontalColorLegend/HorizontalColorLegends";
import { CategoricalBin } from "../color/ColorScaleBin";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
export interface StackedDiscreteBarChartManager extends ChartManager {
    endTime?: Time;
}
export declare class StackedDiscreteBarChart extends React.Component<{
    bounds?: Bounds;
    manager: StackedDiscreteBarChartManager;
}> implements ChartInterface, HorizontalColorLegendManager {
    base: React.RefObject<SVGGElement>;
    transformTable(table: OwidTable): OwidTable;
    focusSeriesName?: SeriesName;
    get inputTable(): OwidTable;
    get transformedTable(): OwidTable;
    private get manager();
    private get bounds();
    private get baseFontSize();
    private get labelStyle();
    private get labelWidth();
    private get x0();
    private get allPoints();
    private get xDomainDefault();
    private get xRange();
    private get yAxis();
    private get axis();
    private get innerBounds();
    private get selectionArray();
    private get items();
    private get barHeight();
    private get barSpacing();
    get legendPaddingTop(): number;
    get legendX(): number;
    get categoryLegendY(): number;
    get legendWidth(): number;
    get legendAlign(): LegendAlign;
    get fontSize(): number;
    get categoricalLegendData(): CategoricalBin[];
    onLegendMouseOver(bin: CategoricalBin): void;
    onLegendMouseLeave(): void;
    private get legend();
    private get formatColumn();
    render(): JSX.Element;
    private renderBar;
    private static Tooltip;
    get failMessage(): string;
    protected get yColumnSlugs(): string[];
    protected get yColumns(): CoreColumn[];
    private get colorScheme();
    private get unstackedSeries();
    get series(): readonly StackedSeries<EntityName>[];
}
//# sourceMappingURL=StackedDiscreteBarChart.d.ts.map