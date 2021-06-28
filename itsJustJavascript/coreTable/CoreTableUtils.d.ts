import { DSVParsedArray } from "d3-dsv";
import { CoreColumnStore, CoreRow, ColumnSlug, CoreMatrix, Time, CoreValueType } from "./CoreTableConstants";
import { CoreColumnDef } from "./CoreColumnDef";
import { ErrorValue } from "./ErrorValues";
export declare const columnStoreToRows: (columnStore: CoreColumnStore) => Record<string, CoreValueType>[];
export declare const truncate: (str: string, maxLength: number) => string;
export declare const makeAutoTypeFn: (numericSlugs?: string[] | undefined) => (object: any) => any;
export declare const standardizeSlugs: (rows: CoreRow[]) => {
    rows: CoreRow[];
    defs: {
        name: string;
        slug: string;
    }[];
} | undefined;
export declare const guessColumnDefFromSlugAndRow: (slug: string, sampleValue: any) => CoreColumnDef;
export declare const makeRowFromColumnStore: (rowIndex: number, columnStore: CoreColumnStore) => CoreRow;
export interface InterpolationContext {
}
export interface LinearInterpolationContext extends InterpolationContext {
    extrapolateAtStart?: boolean;
    extrapolateAtEnd?: boolean;
}
export interface ToleranceInterpolationContext extends InterpolationContext {
    timeTolerance: number;
}
export declare type InterpolationProvider<C extends InterpolationContext> = (valuesSortedByTimeAsc: (number | ErrorValue)[], timesAsc: Time[], context: C, start: number, end: number) => void;
export declare function linearInterpolation(valuesSortedByTimeAsc: (number | ErrorValue)[], timesAsc: Time[], context: LinearInterpolationContext, start?: number, end?: number): void;
export declare function toleranceInterpolation(valuesSortedByTimeAsc: (number | ErrorValue)[], timesAsc: Time[], context: ToleranceInterpolationContext, start?: number, end?: number): void;
export declare function interpolateRowValuesWithTolerance<ValueSlug extends ColumnSlug, TimeSlug extends ColumnSlug, Row extends {
    [key in TimeSlug]?: Time;
} & {
    [key in ValueSlug]?: any;
}>(rowsSortedByTimeAsc: Row[], valueSlug: ValueSlug, timeSlug: TimeSlug, timeTolerance: number): Row[];
export declare const makeKeyFn: (columnStore: CoreColumnStore, columnSlugs: ColumnSlug[]) => (rowIndex: number) => string;
export declare const imemo: <Type>(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<Type>) => void;
export declare const appendRowsToColumnStore: (columnStore: CoreColumnStore, rows: CoreRow[]) => CoreColumnStore;
export declare const concatColumnStores: (stores: CoreColumnStore[], slugsToKeep?: string[] | undefined) => CoreColumnStore;
export declare const rowsToColumnStore: (rows: CoreRow[]) => CoreColumnStore;
export declare const autodetectColumnDefs: (rowsOrColumnStore: CoreColumnStore | CoreRow[], definedSlugs: Map<ColumnSlug, any>) => CoreColumnDef[];
export declare const replaceDef: <ColumnDef extends CoreColumnDef>(defs: ColumnDef[], newDefs: ColumnDef[]) => ColumnDef[];
export declare const reverseColumnStore: (columnStore: CoreColumnStore) => CoreColumnStore;
export declare const renameColumnStore: (columnStore: CoreColumnStore, columnRenameMap: {
    [columnSlug: string]: string;
}) => CoreColumnStore;
export declare const replaceCells: (columnStore: CoreColumnStore, columnSlugs: ColumnSlug[], replaceFn: (val: CoreValueType) => CoreValueType) => CoreColumnStore;
export declare const getDropIndexes: (arrayLength: number, howMany: number, seed?: number) => Set<number>;
export declare const replaceRandomCellsInColumnStore: (columnStore: CoreColumnStore, howMany?: number, columnSlugs?: ColumnSlug[], seed?: number, replacementGenerator?: () => any) => CoreColumnStore;
export declare class Timer {
    constructor();
    private _tickTime;
    private _firstTickTime;
    tick(msg?: string): number;
    getTotalElapsedTime(): number;
}
export declare const rowsFromMatrix: (matrix: CoreMatrix) => any[];
export declare const trimMatrix: (matrix: CoreMatrix) => CoreMatrix;
export declare const matrixToDelimited: (table: CoreMatrix, delimiter?: string) => string;
export declare const parseDelimited: (str: string, delimiter?: string | undefined, parseFn?: any) => DSVParsedArray<Record<string, unknown>>;
export declare const detectDelimiter: (str: string) => "\t" | "," | " ";
export declare const rowsToMatrix: (rows: any[]) => CoreMatrix | undefined;
export declare const isCellEmpty: (cell: any) => boolean;
export declare const trimEmptyRows: (matrix: CoreMatrix) => CoreMatrix;
export declare const trimArray: (arr: any[]) => any[];
export declare function cartesianProduct<T>(...allEntries: T[][]): T[][];
export declare const sortColumnStore: (columnStore: CoreColumnStore, slugs: ColumnSlug[]) => CoreColumnStore;
export declare const emptyColumnsInFirstRowInDelimited: (str: string) => string[];
//# sourceMappingURL=CoreTableUtils.d.ts.map