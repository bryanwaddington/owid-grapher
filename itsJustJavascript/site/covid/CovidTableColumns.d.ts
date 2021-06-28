/// <reference types="react" />
import { ScaleLinear } from "d3-scale";
import { CovidTableHeaderCellProps } from "./CovidTableHeaderCell";
import { CovidSortKey, CovidCountryDatum, CovidDatum } from "./CovidTypes";
import { SparkBarsProps } from "../../grapher/sparkBars/SparkBars";
export declare enum CovidTableColumnKey {
    location = "location",
    locationTests = "locationTests",
    totalCases = "totalCases",
    newCases = "newCases",
    totalDeaths = "totalDeaths",
    newDeaths = "newDeaths",
    daysToDoubleCases = "daysToDoubleCases",
    daysToDoubleDeaths = "daysToDoubleDeaths",
    totalTests = "totalTests",
    testDate = "testDate",
    testSource = "testSource"
}
export declare type CovidTableHeaderSpec = Omit<CovidTableHeaderCellProps, "children" | "sortKey"> & {
    isMobile: boolean;
    lastUpdated: Date | undefined;
};
export interface CovidTableCellSpec {
    datum: CovidCountryDatum;
    isMobile: boolean;
    bars: Pick<SparkBarsProps<CovidDatum>, "data" | "xDomain" | "x" | "currentX" | "highlightedX" | "onHover">;
    totalTestsBarScale: ScaleLinear<number, number>;
    countryColors: Record<string, string>;
    baseRowSpan: number;
}
export interface CovidTableColumnSpec {
    sortKey?: CovidSortKey;
    header: (props: CovidTableHeaderSpec) => JSX.Element;
    cell: (props: CovidTableCellSpec) => JSX.Element;
}
export declare const columns: Record<CovidTableColumnKey, CovidTableColumnSpec>;
//# sourceMappingURL=CovidTableColumns.d.ts.map