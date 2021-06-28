import { CoreColumn } from "./CoreTableColumns";
import { ColumnSlug, CoreColumnStore, CoreRow, CoreTableInputOption, PrimitiveType, TransformType, ValueRange, CoreQuery, CoreValueType, CoreMatrix, TableSlug, JsTypes } from "./CoreTableConstants";
import { ColumnTypeNames, CoreColumnDef } from "./CoreColumnDef";
import { AlignedTextTableOptions } from "./CoreTablePrinters";
interface AdvancedOptions {
    tableDescription?: string;
    transformCategory?: TransformType;
    parent?: CoreTable;
    filterMask?: FilterMask;
    tableSlug?: TableSlug;
    skipParsing?: boolean;
}
export declare class CoreTable<ROW_TYPE extends CoreRow = CoreRow, COL_DEF_TYPE extends CoreColumnDef = CoreColumnDef> {
    private _columns;
    protected parent?: this;
    tableDescription: string;
    private timeToLoad;
    private initTime;
    private originalInput;
    private advancedOptions;
    private inputColumnDefs;
    constructor(input?: CoreTableInputOption, inputColumnDefs?: COL_DEF_TYPE[] | string, advancedOptions?: AdvancedOptions);
    private valuesFromColumnDefs;
    get autodetectedColumnDefs(): CoreTable;
    get transformCategory(): TransformType;
    private get inputColumnStore();
    get columnStore(): CoreColumnStore;
    private get blankColumnStore();
    private get delimitedAsColumnStore();
    get tableSlug(): string | undefined;
    private get inputColumnsToParsedColumnStore();
    private get colsToParse();
    toOneDimensionalArray(): any;
    private setColumn;
    protected transform(rowsOrColumnStore: ROW_TYPE[] | CoreColumnStore | CoreMatrix, defs: COL_DEF_TYPE[], tableDescription: string, transformCategory: TransformType, filterMask?: FilterMask): this;
    private get betweenTime();
    get rows(): ROW_TYPE[];
    get indices(): number[];
    [Symbol.iterator](): Generator<CoreRow, void, unknown>;
    getTimesAtIndices(indices: number[]): number[];
    getValuesAtIndices(columnSlug: ColumnSlug, indices: number[]): CoreValueType[];
    get firstRow(): ROW_TYPE;
    get lastRow(): ROW_TYPE;
    get numRows(): number;
    get numColumns(): number;
    get(columnSlug: ColumnSlug | undefined): CoreColumn;
    has(columnSlug: ColumnSlug | undefined): boolean;
    getFirstColumnWithType(columnTypeName: ColumnTypeNames): CoreColumn | undefined;
    get timeColumn(): CoreColumn;
    get entityNameColumn(): CoreColumn;
    get entityNameSlug(): string;
    get timeColumnFormatFunction(): (year: number) => string;
    formatTime(value: any): string;
    private get columnsWithParseErrors();
    get numColumnsWithErrorValues(): number;
    get numErrorValues(): number;
    get numValidCells(): number;
    get rootTable(): this;
    /**
     * Returns a string map (aka index) where the keys are the combined string values of columnSlug[], and the values
     * are the indices for the rows that match.
     *
     * {country: "USA", population: 100}
     *
     * So `table.rowIndex(["country", "population"]).get("USA 100")` would return [0].
     *
     */
    rowIndex(columnSlugs: ColumnSlug[]): Map<string, number[]>;
    /**
     * Returns a map (aka index) where the keys are the values of the indexColumnSlug, and the values
     * are the values of the valueColumnSlug.
     *
     * {country: "USA", population: 100}
     *
     * So `table.valueIndex("country", "population").get("USA")` would return 100.
     *
     */
    protected valueIndex(indexColumnSlug: ColumnSlug, valueColumnSlug: ColumnSlug): Map<PrimitiveType, PrimitiveType>;
    grep(searchStringOrRegex: string | RegExp): this;
    get opposite(): this;
    get oppositeColumns(): this;
    grepColumns(searchStringOrRegex: string | RegExp): this;
    rowFilter(predicate: (row: ROW_TYPE, index: number) => boolean, opName: string): this;
    columnFilter(columnSlug: ColumnSlug, predicate: (value: CoreValueType, index: number) => boolean, opName: string): this;
    sortBy(slugs: ColumnSlug[]): this;
    sortColumns(slugs: ColumnSlug[]): this;
    reverse(): this;
    protected groupBoundaries(columnSlug: ColumnSlug): number[];
    get defs(): COL_DEF_TYPE[];
    get columnNames(): string[];
    get columnTypes(): (ColumnTypeNames | undefined)[];
    get columnJsTypes(): JsTypes[];
    get columnSlugs(): string[];
    get numericColumnSlugs(): string[];
    private get _numericColumnSlugs();
    private get _columnsAsArray();
    get columnsAsArray(): CoreColumn[];
    getColumns(slugs: ColumnSlug[]): CoreColumn[];
    domainFor(slugs: ColumnSlug[]): ValueRange;
    private extract;
    private get isRoot();
    dump(rowLimit?: number): void;
    dumpPipeline(): void;
    dumpColumns(): void;
    rowsFrom(start: number, end: number): any;
    dumpRows(rowLimit?: number): void;
    dumpInputTable(): void;
    private get inputType();
    private get inputColumnStoreToRows();
    private get inputAsTable();
    private get explainColumns();
    get ancestors(): this[];
    private get numColsToParse();
    private static guids;
    private guid;
    private get explanation();
    toAlignedTextTable(options?: AlignedTextTableOptions): string;
    toMarkdownTable(): string;
    toDelimited(delimiter?: string, columnSlugs?: string[], rows?: ROW_TYPE[]): string;
    toTsv(): string;
    toCsvWithColumnNames(): string;
    get constantColumns(): CoreColumn[];
    rowsAt(indices: number[]): ROW_TYPE[];
    findRows(query: CoreQuery): ROW_TYPE[];
    findRowsIndices(query: CoreQuery): any;
    indexOf(row: ROW_TYPE): any;
    where(query: CoreQuery): this;
    appendRows(rows: ROW_TYPE[], opDescription: string): this;
    limit(howMany: number, offset?: number): this;
    updateDefs(fn: (def: COL_DEF_TYPE) => COL_DEF_TYPE): this;
    limitColumns(howMany: number, offset?: number): this;
    select(slugs: ColumnSlug[]): this;
    dropColumns(slugs: ColumnSlug[], message?: string): this;
    get duplicateRowIndices(): number[];
    dropDuplicateRows(): this;
    isRowEmpty(index: number): boolean;
    dropEmptyRows(): this;
    renameColumn(oldSlug: ColumnSlug, newSlug: ColumnSlug): this;
    renameColumns(columnRenameMap: {
        [columnSlug: string]: ColumnSlug;
    }): this;
    dropRowsAt(indices: number[], message?: string): this;
    dropRandomRows(howMany?: number, seed?: number): this;
    replaceNonPositiveCellsForLogScale(columnSlugs?: ColumnSlug[]): this;
    replaceNonNumericCellsWithErrorValues(columnSlugs: ColumnSlug[]): this;
    replaceRandomCells(howMany?: number, columnSlugs?: ColumnSlug[], seed?: number, replacementGenerator?: () => any): this;
    dropRandomPercent(dropHowMuch?: number, seed?: number): this;
    isGreaterThan(columnSlug: ColumnSlug, value: PrimitiveType, opName?: string): this;
    filterNegativesForLogScale(columnSlug: ColumnSlug): this;
    filterNegatives(slug: ColumnSlug): this;
    appendColumns(defs: COL_DEF_TYPE[]): this;
    duplicateColumn(slug: ColumnSlug, overrides: COL_DEF_TYPE): this;
    transpose(by: ColumnSlug, columnTypeNameForNewColumns?: ColumnTypeNames): this;
    columnIntersection(tables: CoreTable[]): string[];
    private intersectingRowIndices;
    intersection(tables: CoreTable[]): this;
    difference(tables: CoreTable[]): this;
    appendColumnsIfNew(defs: COL_DEF_TYPE[]): this;
    toMatrix(): any[][];
    toTypedMatrix(): any[][];
    defToObject(): any;
    toJs(): {
        columns: any;
        rows: ROW_TYPE[];
    };
    private join;
    concat(tables: CoreTable[], message?: string): this;
    /**
     * Ensure a row exists for all values in columnSlug1 × columnSlug2 × ...
     *
     * For example, if we have a table:
     *
     *   ```
     *   entityName, year, …
     *   UK, 2000, …
     *   UK, 2005, …
     *   USA, 2003, …
     *   ```
     *
     * After `complete(["entityName", "year"])`, we'd get:
     *
     *   ```
     *   entityName, year, …
     *   UK, 2000, …
     *   UK, 2003, …
     *   UK, 2005, …
     *   USA, 2000, …
     *   USA, 2003, …
     *   USA, 2005, …
     *   ```
     *
     */
    complete(columnSlugs: ColumnSlug[]): this;
    leftJoin(rightTable: CoreTable, by?: ColumnSlug[]): this;
    rightJoin(rightTable: CoreTable, by?: ColumnSlug[]): this;
    innerJoin(rightTable: CoreTable, by?: ColumnSlug[]): this;
    fullJoin(rightTable: CoreTable, by?: ColumnSlug[]): this;
    union(tables: CoreTable[]): this;
    indexBy(slug: ColumnSlug): Map<CoreValueType, number[]>;
    groupBy(by: ColumnSlug): this[];
    reduce(reductionMap: ReductionMap): this;
}
interface ReductionMap {
    [columnSlug: string]: ReductionTypes | ((column: CoreColumn) => CoreValueType);
}
declare type ReductionTypes = keyof CoreColumn;
declare class FilterMask {
    private mask;
    private numRows;
    constructor(numRows: number, input: boolean[] | number[], keepThese?: boolean);
    inverse(): FilterMask;
    apply(columnStore: CoreColumnStore): CoreColumnStore;
}
/**
 * Allows you to store your column definitions in CSV/TSV like:
 * slug,name,type etc.
 *
 * todo: define all column def property types
 */
export declare const columnDefinitionsFromDelimited: <T>(delimited: string) => T[];
export {};
//# sourceMappingURL=CoreTable.d.ts.map