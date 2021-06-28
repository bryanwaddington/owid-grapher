export declare const CellHasErrorsClass = "CellHasErrorsClass";
export declare enum GridBoolean {
    true = "true",
    false = "false"
}
export declare const GRID_NODE_DELIMITER = "\n";
export declare const GRID_CELL_DELIMITER = "\t";
export declare const GRID_EDGE_DELIMITER = "\t";
export declare type CellCoordinate = number;
export declare type Grammar = {
    [keywordSlug: string]: CellDef;
};
export interface CellDef {
    keyword: string;
    cssClass: string;
    description: string;
    grammar?: Grammar;
    headerCellDef?: CellDef;
    terminalOptions?: CellDef[];
    catchAllCellDef?: CellDef;
    regex?: RegExp;
    requirementsDescription?: string;
    valuePlaceholder?: string;
    positionalCellDefs?: readonly CellDef[];
    isHorizontalList?: boolean;
    parse?: (value: any) => any;
}
export interface ParsedCell {
    errorMessage?: string;
    cssClasses?: string[];
    optionKeywords?: string[];
    comment?: string;
    cellDef?: CellDef;
    placeholder?: string;
    contents?: any;
}
export interface CellPosition {
    row: CellCoordinate;
    column: CellCoordinate;
}
export declare const Origin: CellPosition;
export declare const BooleanCellDef: CellDef;
export declare const StringCellDef: CellDef;
export declare const StringDeclarationDef: CellDef;
export declare const EnumCellDef: CellDef;
export declare const RootKeywordCellDef: CellDef;
export declare const NumericCellDef: CellDef;
export declare const IntegerCellDef: CellDef;
export declare const SubTableHeaderCellDef: CellDef;
export declare const SubTableValueCellDef: CellDef;
export declare const UrlCellDef: CellDef;
export declare const QueryStringCellDef: CellDef;
export declare const NothingGoesThereCellDef: CellDef;
export declare const CommentCellDef: CellDef;
export declare const WorkInProgressCellDef: CellDef;
export declare const SlugDeclarationCellDef: CellDef;
export declare const FrontierCellClass = "ShowDropdownArrow";
export declare const SlugsDeclarationCellDef: CellDef;
export declare type MatrixLine = string[];
export declare type MatrixProgram = MatrixLine[];
//# sourceMappingURL=GridLangConstants.d.ts.map