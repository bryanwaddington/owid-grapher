import * as React from "react";
import { ColumnSlug, Time } from "../../coreTable/CoreTableConstants";
import { TickFormattingOptions } from "../../clientUtils/formatValue";
import { OwidTable } from "../../coreTable/OwidTable";
import { CoreColumn } from "../../coreTable/CoreTableColumns";
import { Bounds } from "../../clientUtils/Bounds";
export interface DataTableManager {
    table: OwidTable;
    endTime?: Time;
    startTime?: Time;
    minPopulationFilter?: number;
    dataTableSlugs?: ColumnSlug[];
}
export declare class DataTable extends React.Component<{
    manager?: DataTableManager;
    bounds?: Bounds;
}> {
    private storedState;
    private get tableState();
    private get sortState();
    get table(): OwidTable;
    get inputTable(): OwidTable;
    get manager(): DataTableManager;
    private get entityType();
    private get sortValueMapper();
    private get hasSubheaders();
    private updateSort;
    private get entityHeader();
    private get dimensionHeaders();
    private get dimensionSubheaders();
    private get headerRow();
    private renderValueCell;
    private renderEntityRow;
    private get valueRows();
    get bounds(): Bounds;
    render(): JSX.Element;
    private get loadedWithData();
    private readonly AUTO_SELECTION_THRESHOLD_PERCENTAGE;
    /**
     * If the user or the editor hasn't specified a start, auto-select a start time
     *  where AUTO_SELECTION_THRESHOLD_PERCENTAGE of the entities have values.
     */
    get autoSelectedStartTime(): number | undefined;
    private get columnsToShow();
    private get selectionArray();
    private get entityNames();
    componentDidMount(): void;
    formatValue(column: CoreColumn, value: number | string | undefined, formattingOverrides?: TickFormattingOptions): string | undefined;
    get targetTimes(): number[] | undefined;
    get columnsWithValues(): Dimension[];
    get displayDimensions(): DataTableDimension[];
    private get sortedRows();
    private get displayRows();
}
declare enum TargetTimeMode {
    point = "point",
    range = "range"
}
interface Dimension {
    columns: DimensionColumn[];
    valueByEntity: Map<string, DimensionValue>;
    sourceColumn: CoreColumn;
}
interface DimensionColumn {
    key: SingleValueKey | RangeValueKey;
    targetTime?: Time;
    targetTimeMode?: TargetTimeMode;
}
interface DataTableColumn extends DimensionColumn {
    sortable: boolean;
}
interface Value {
    value?: string | number;
    displayValue?: string;
    time?: Time;
}
declare enum RangeValueKey {
    start = "start",
    end = "end",
    delta = "delta",
    deltaRatio = "deltaRatio"
}
declare type RangeValue = Record<RangeValueKey, Value | undefined>;
declare enum SingleValueKey {
    single = "single"
}
declare type SingleValue = Record<SingleValueKey, Value | undefined>;
declare type DimensionValue = SingleValue | RangeValue;
interface DataTableDimension {
    columns: DataTableColumn[];
    coreTableColumn: CoreColumn;
    sortable: boolean;
}
export {};
//# sourceMappingURL=DataTable.d.ts.map