import { ErrorValue } from "./ErrorValues";
export declare type TableSlug = string;
export declare type ColumnSlug = string;
export declare type ColumnSlugs = string;
export declare type Integer = number;
export declare enum SortOrder {
    asc = "asc",
    desc = "desc"
}
export declare type Year = Integer;
export declare type Color = string;
/**
 * A concrete point in time (year or date). It's always supposed to be a finite number, but we
 * cannot enforce this in TypeScript.
 */
export declare type Time = Integer;
export declare type TimeRange = [Time, Time];
export declare type PrimitiveType = number | string | boolean;
export declare type ValueRange = [number, number];
export declare type TimeTolerance = Integer;
export interface CoreRow {
    [columnSlug: string]: any;
}
export declare enum InputType {
    Delimited = "Delimited",
    RowStore = "RowStore",
    ColumnStore = "ColumnStore",
    Matrix = "Matrix"
}
export declare enum TransformType {
    LoadFromDelimited = "LoadFromDelimited",
    LoadFromRowStore = "LoadFromRowStore",
    LoadFromColumnStore = "LoadFromColumnStore",
    LoadFromMatrix = "LoadFromMatrix",
    Transpose = "Transpose",
    Concat = "Concat",
    Reduce = "Reduce",
    FilterRows = "FilterRows",
    SortRows = "SortRows",
    AppendRows = "AppendRows",
    UpdateRows = "UpdateRows",
    InverseFilterRows = "InverseFilterRows",
    FilterColumns = "FilterColumns",
    SortColumns = "SortColumns",
    AppendColumns = "AppendColumns",
    UpdateColumnDefs = "UpdateColumnDefs",
    UpdateColumnDefsAndApply = "UpdateColumnDefsAndApply",
    RenameColumns = "RenameColumns",
    InverseFilterColumns = "InverseFilterColumns"
}
export declare enum JsTypes {
    string = "string",
    boolean = "boolean",
    number = "number"
}
export declare type CsvString = string;
export declare type CoreValueType = PrimitiveType | ErrorValue;
/**
 * An Object Literal of Column Slugs and Primitives of the same type:
 * {
 *  score: [1, 2, 3],
 *  year: [2000, 2001]
 * }
 */
export declare type CoreColumnStore = {
    [columnSlug: string]: CoreValueType[];
};
export declare type CoreTableInputOption = CoreRow[] | CoreColumnStore | CsvString | CoreMatrix;
export interface CoreQuery {
    [columnSlug: string]: PrimitiveType | PrimitiveType[];
}
declare type CoreVector = any[];
/**
 * This is just an array of arrays where the first array is the header and the rest are rows. An example is:
 * [["country", "gdp"],
 * ["usa", 123],
 * ["can", 456]]
 * Having this type is just to provide a common unique name for the basic structure used by HandsOnTable
 * and some other popular JS data libraries.
 */
export declare type CoreMatrix = CoreVector[];
export {};
//# sourceMappingURL=CoreTableConstants.d.ts.map