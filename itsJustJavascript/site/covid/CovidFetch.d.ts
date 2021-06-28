/// <reference types="lodash" />
import { CovidSeries } from "./CovidTypes";
declare function _fetchJHUData(): Promise<CovidSeries>;
export declare const fetchJHUData: typeof _fetchJHUData & import("lodash").MemoizedFunction;
export interface CovidTestsDatum {
    totalTests: number | undefined;
    totalPositiveTests: number | undefined;
    sourceURL: string | undefined;
    sourceLabel: string | undefined;
    publicationDate: Date;
    remarks: string | undefined;
    population: number | undefined;
    nonOfficial: boolean;
}
export declare function fetchTestsData(): Promise<CovidSeries>;
export {};
//# sourceMappingURL=CovidFetch.d.ts.map