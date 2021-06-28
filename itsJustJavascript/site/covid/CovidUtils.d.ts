import { SortOrder } from "../../coreTable/CoreTableConstants";
import { TickFormattingOptions } from "../../clientUtils/formatValue";
import { CovidSeries, CovidDatum, CovidDoublingRange, CovidSortKey, CovidSortAccessor } from "./CovidTypes";
export declare function inverseSortOrder(order: SortOrder): SortOrder;
export declare function formatInt(n: number | undefined, defaultValue?: string, options?: TickFormattingOptions): string;
export declare const defaultTimeFormat: (date: Date) => string;
export declare function formatDate(date: Date | undefined, defaultValue?: string): string;
export declare function createNoun(singular: string, plural: string): (num: number | undefined) => string;
export declare function getDoublingRange(series: CovidSeries, accessor: (d: CovidDatum) => number | undefined): CovidDoublingRange | undefined;
export declare const sortAccessors: Record<CovidSortKey, CovidSortAccessor>;
//# sourceMappingURL=CovidUtils.d.ts.map