import * as React from "react";
import { SortOrder } from "../../coreTable/CoreTableConstants";
import { CovidSortKey, CovidSeries, CovidCountrySeries, DateRange, CovidCountryDatum } from "./CovidTypes";
import { CovidTableColumnKey, CovidTableHeaderSpec, CovidTableCellSpec } from "./CovidTableColumns";
export declare class CovidTableState {
    sortKey: CovidSortKey;
    sortOrder: SortOrder;
    isMobile: boolean;
    truncate: boolean;
    truncateLength: number;
    constructor(state: Partial<CovidTableState>);
}
export interface CovidTableProps {
    columns: CovidTableColumnKey[];
    mobileColumns: CovidTableColumnKey[];
    defaultState: Partial<CovidTableState>;
    filter: (datum: CovidCountryDatum) => any;
    loadData: () => Promise<CovidSeries>;
    preloadData?: CovidSeries;
    extraRow?: (props: CovidTableCellSpec) => JSX.Element | undefined;
    footer?: JSX.Element;
}
export declare class CovidTable extends React.Component<CovidTableProps> {
    static defaultProps: CovidTableProps;
    data: CovidSeries | undefined;
    isLoaded: boolean;
    isLoading: boolean;
    error: string | undefined;
    tableState: CovidTableState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    onResizeThrottled?: () => void;
    onResize(): void;
    loadData(): Promise<void>;
    get countrySeries(): CovidCountrySeries;
    get rowData(): {
        shown: CovidCountrySeries;
        truncated: CovidCountrySeries;
        hidden: CovidCountrySeries;
    };
    get isTruncated(): boolean;
    get dateRange(): DateRange;
    get lastUpdated(): Date | undefined;
    get totalTestsBarScale(): import("d3-scale").ScaleLinear<number, number>;
    get columns(): CovidTableColumnKey[];
    onSort(newKey: CovidSortKey): void;
    get headerCellProps(): CovidTableHeaderSpec;
    get countryColors(): Record<string, string>;
    onShowMore(): void;
    render(): JSX.Element | null;
}
//# sourceMappingURL=CovidTable.d.ts.map