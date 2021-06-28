import React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { ChartManager } from "../chart/ChartManager";
import { ChartInterface } from "../chart/ChartInterface";
import { FacetSeries, FacetChartProps, PlacedFacetSeries } from "./FacetChartConstants";
import { OwidTable } from "../../coreTable/OwidTable";
export declare class FacetChart extends React.Component<FacetChartProps> implements ChartInterface {
    transformTable(table: OwidTable): OwidTable;
    get inputTable(): OwidTable;
    get transformedTable(): OwidTable;
    get placedSeries(): PlacedFacetSeries[];
    private get selectionArray();
    private get countryFacets();
    private get columnFacets();
    private get yColumns();
    private get yColumnSlugs();
    get series(): FacetSeries[];
    protected get bounds(): Bounds;
    protected get manager(): ChartManager;
    get failMessage(): string;
    private get subtitleFontSize();
    render(): JSX.Element[];
}
//# sourceMappingURL=FacetChart.d.ts.map