import * as React from "react";
import { Bounds } from "../../clientUtils/Bounds";
import { VerticalColorLegendManager } from "../verticalColorLegend/VerticalColorLegend";
import { ColorScale, ColorScaleManager } from "../color/ColorScale";
import { ChartInterface } from "../chart/ChartInterface";
import { ChartManager } from "../chart/ChartManager";
import { SlopeChartSeries, SlopeProps } from "./SlopeChartConstants";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
import { OwidTable } from "../../coreTable/OwidTable";
import { ColorSchemeName } from "../color/ColorConstants";
export declare class SlopeChart extends React.Component<{
    bounds?: Bounds;
    manager: ChartManager;
}> implements ChartInterface, VerticalColorLegendManager, ColorScaleManager {
    hoverKey?: string;
    hoverColor?: string;
    transformTable(table: OwidTable): OwidTable;
    get manager(): ChartManager;
    get bounds(): Bounds;
    get fontSize(): number;
    get legendItems(): {
        key: string;
        label: string;
        color: string;
    }[];
    get maxLegendWidth(): number;
    onSlopeMouseOver(slopeProps: SlopeProps): void;
    onSlopeMouseLeave(): void;
    onSlopeClick(): void;
    onLegendMouseOver(color: string): void;
    onLegendMouseLeave(): void;
    private get selectionArray();
    private get selectedEntityNames();
    onLegendClick(): void;
    get focusColors(): string[];
    get focusKeys(): string[];
    get hoverKeys(): string[];
    get activeColors(): string[];
    private get colorsInUse();
    private get sidebarMaxWidth();
    private sidebarMinWidth;
    private get legendWidth();
    private get sidebarWidth();
    private get innerBounds();
    private get showLegend();
    render(): JSX.Element;
    get legendY(): number;
    get legendX(): number;
    get failMessage(): "" | "No matching data" | "Missing Y column";
    colorScale: ColorScale;
    get colorScaleConfig(): import("../color/ColorScaleConfig").ColorScaleConfigDefaults | undefined;
    get colorScaleColumn(): CoreColumn;
    defaultBaseColorScheme: ColorSchemeName;
    private get yColumn();
    protected get yColumnSlug(): string;
    private get colorColumn();
    get transformedTable(): OwidTable;
    get inputTable(): OwidTable;
    private get colorBySeriesName();
    private get sizeColumn();
    private get sizeByEntity();
    componentDidMount(): void;
    get series(): SlopeChartSeries[];
}
//# sourceMappingURL=SlopeChart.d.ts.map