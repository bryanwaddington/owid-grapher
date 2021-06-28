import { CovidTestsDatum } from "./CovidFetch";
export interface CovidDatum {
    date: Date;
    location: string;
    totalCases?: number;
    totalDeaths?: number;
    newCases?: number;
    newDeaths?: number;
    tests?: CovidTestsDatum;
}
export declare type CovidSeries = CovidDatum[];
export interface CovidCountryDatum {
    id: string;
    location: string;
    series: CovidSeries;
    latest: CovidDatum | undefined;
    latestWithTests: CovidDatum | undefined;
    caseDoublingRange: CovidDoublingRange | undefined;
    deathDoublingRange: CovidDoublingRange | undefined;
}
export declare type CovidCountrySeries = CovidCountryDatum[];
export interface CovidDoublingRange {
    latestDay: CovidDatum;
    halfDay: CovidDatum;
    length: number;
    ratio: number;
}
export declare type DateRange = [Date, Date];
export declare enum CovidSortKey {
    location = "location",
    totalCases = "totalCases",
    newCases = "newCases",
    totalDeaths = "totalDeaths",
    newDeaths = "newDeaths",
    daysToDoubleCases = "daysToDoubleCases",
    daysToDoubleDeaths = "daysToDoubleDeaths",
    totalTests = "totalTests",
    testDate = "testDate"
}
export declare type CovidSortAccessor = (datum: CovidCountryDatum) => Date | string | number | undefined;
export declare type NounKey = "cases" | "deaths" | "tests" | "days";
export declare type NounGenerator = (n?: number) => string;
//# sourceMappingURL=CovidTypes.d.ts.map