import { DualAxis } from "../axis/Axis";
import { FontSizeManager } from "../axis/AxisConfig";
import { ChartInterface } from "../chart/ChartInterface";
import { ChartManager } from "../chart/ChartManager";
import { SeriesName, SeriesStrategy } from "../core/GrapherConstants";
import { Bounds } from "../../clientUtils/Bounds";
import React from "react";
import { StackedPointPositionType, StackedSeries } from "./StackedConstants";
import { OwidTable } from "../../coreTable/OwidTable";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
import { SelectionArray } from "../selection/SelectionArray";
export interface AbstactStackedChartProps {
    bounds?: Bounds;
    manager: ChartManager;
    disableLinearInterpolation?: boolean;
}
export declare class AbstactStackedChart<PositionType extends StackedPointPositionType> extends React.Component<AbstactStackedChartProps> implements ChartInterface, FontSizeManager {
    transformTable(table: OwidTable): OwidTable;
    get inputTable(): OwidTable;
    get transformedTable(): OwidTable;
    get manager(): ChartManager;
    get bounds(): Bounds;
    get fontSize(): number;
    protected get paddingForLegend(): number;
    get renderUid(): number;
    protected get yColumns(): CoreColumn[];
    protected get yColumnSlugs(): string[];
    private animSelection?;
    base: React.RefObject<SVGGElement>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    get seriesStrategy(): SeriesStrategy;
    protected get dualAxis(): DualAxis;
    private get horizontalAxisPart();
    private get verticalAxisPart();
    private get columnsAsSeries();
    private get entitiesAsSeries();
    protected get rawSeries(): {
        isProjection: boolean;
        seriesName: string;
        rows: import("../../coreTable/CoreTableConstants").CoreRow[];
    }[];
    protected get allStackedPoints(): import("./StackedConstants").StackedPoint<PositionType>[];
    get failMessage(): string;
    private get colorScheme();
    getColorForSeries(seriesName: SeriesName): string;
    protected get selectionArray(): SelectionArray;
    get isEntitySeries(): boolean;
    get seriesColors(): string[];
    /** Whether we want to display series with only zeroes. Defaults to true but e.g. StackedArea charts want to set this to false */
    get showAllZeroSeries(): boolean;
    get unstackedSeries(): readonly StackedSeries<PositionType>[];
    get series(): readonly StackedSeries<PositionType>[];
}
//# sourceMappingURL=AbstractStackedChart.d.ts.map