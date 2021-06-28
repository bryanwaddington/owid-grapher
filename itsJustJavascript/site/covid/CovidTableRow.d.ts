import * as React from "react";
import { ScaleLinear } from "d3-scale";
import { CovidCountryDatum, DateRange, CovidDatum } from "./CovidTypes";
import { CovidTableState } from "./CovidTable";
import { CovidTableColumnKey, CovidTableCellSpec } from "./CovidTableColumns";
export interface CovidTableTransform {
    dateRange: DateRange;
    totalTestsBarScale: ScaleLinear<number, number>;
    countryColors: Record<string, string>;
}
export interface CovidTableRowProps {
    columns: CovidTableColumnKey[];
    datum: CovidCountryDatum;
    transform: CovidTableTransform;
    state: CovidTableState;
    className?: string;
    extraRow?: (props: CovidTableCellSpec) => JSX.Element | undefined;
    onHighlightDate: (date: Date | undefined) => void;
}
export declare class CovidTableRow extends React.Component<CovidTableRowProps> {
    static defaultProps: {
        onHighlightDate: () => undefined;
    };
    highlightDate: Date | undefined;
    get data(): CovidDatum[];
    dateToIndex(date: Date): number;
    dateFromIndex(index: number): Date;
    get xDomain(): [number, number];
    get currentX(): number | undefined;
    get hightlightedX(): number | undefined;
    x(d: CovidDatum): number;
    onBarHover(d: CovidDatum | undefined, i: number | undefined): void;
    get cellProps(): CovidTableCellSpec;
    render(): JSX.Element;
}
//# sourceMappingURL=CovidTableRow.d.ts.map